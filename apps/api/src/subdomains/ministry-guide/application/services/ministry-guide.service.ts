import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinistryAssignmentRepository } from '../../infrastructure/repositories/ministry-assignment.repository';
import { MinistryFollowupLogRepository } from '../../infrastructure/repositories/ministry-followup-log.repository';
import { MinistryWeeklyReportRepository } from '../../infrastructure/repositories/ministry-weekly-report.repository';
import { MinistryAssignment } from '../../domain/entities/ministry-assignment.entity';
import { MinistryFollowupLog } from '../../domain/entities/ministry-followup-log.entity';
import { MinistryWeeklyReport } from '../../domain/entities/ministry-weekly-report.entity';

@Injectable()
export class MinistryGuideService {
  private readonly logger = new Logger(MinistryGuideService.name);

  constructor(
    private readonly assignmentRepo: MinistryAssignmentRepository,
    private readonly followupRepo: MinistryFollowupLogRepository,
    private readonly weeklyReportRepo: MinistryWeeklyReportRepository,
    private readonly dataSource: DataSource,
  ) {}

  private getCurrentWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setUTCHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  }

  // --- Admin: Assignment management ---

  async createAssignment(data: { leaderId: number; memberId: number; branchId?: number; notes?: string }): Promise<MinistryAssignment> {
    if (data.leaderId === data.memberId) {
      throw new BadRequestException('A leader cannot be assigned to themselves');
    }

    const existing = await this.assignmentRepo.findDuplicate(data.leaderId, data.memberId);
    if (existing) {
      throw new BadRequestException('This member is already assigned to this leader');
    }

    return this.assignmentRepo.create({
      leaderId: data.leaderId,
      memberId: data.memberId,
      branchId: data.branchId || null,
      notes: data.notes || null,
    });
  }

  async bulkAssign(data: { leaderId: number; memberIds: number[]; branchId?: number }): Promise<{ assigned: number; skipped: number }> {
    let assigned = 0;
    let skipped = 0;

    for (const memberId of data.memberIds) {
      if (memberId === data.leaderId) { skipped++; continue; }
      const existing = await this.assignmentRepo.findDuplicate(data.leaderId, memberId);
      if (existing) { skipped++; continue; }

      await this.assignmentRepo.create({
        leaderId: data.leaderId,
        memberId,
        branchId: data.branchId || null,
      });
      assigned++;
    }

    return { assigned, skipped };
  }

  async removeAssignment(id: string): Promise<void> {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new NotFoundException('Assignment not found');
    await this.assignmentRepo.softDelete(id);
  }

  async deactivateAssignment(id: string): Promise<MinistryAssignment> {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new NotFoundException('Assignment not found');
    assignment.isActive = false;
    return this.assignmentRepo.save(assignment);
  }

  async listAssignments(options: { branchId?: number; page?: number; limit?: number } = {}): Promise<{ data: any[]; total: number }> {
    const [assignments, total] = await this.assignmentRepo.findAll(options);

    if (assignments.length === 0) return { data: [], total: 0 };

    // Enrich with user names
    const userIds = [...new Set(assignments.flatMap(a => [a.leaderId, a.memberId]))];
    const users = await this.dataSource.query(`
      SELECT id, name, ea_number as "eaNumber", branch_id as "branchId", phone_number as "phoneNumber"
      FROM users WHERE id = ANY($1)
    `, [userIds]);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const data = assignments.map(a => ({
      ...a,
      leader: userMap.get(a.leaderId) || { id: a.leaderId, name: `User #${a.leaderId}` },
      member: userMap.get(a.memberId) || { id: a.memberId, name: `User #${a.memberId}` },
    }));

    return { data, total };
  }

  private async assertIsLeader(userId: number): Promise<void> {
    const assignments = await this.assignmentRepo.findByLeader(userId);
    if (assignments.length === 0) {
      throw new BadRequestException('You have no members assigned to you');
    }
  }

  // --- Leader: View my members & log follow-ups ---

  async getMyMembers(leaderId: number): Promise<any[]> {
    const assignments = await this.assignmentRepo.findByLeader(leaderId);
    if (assignments.length === 0) return [];

    const weekStart = this.getCurrentWeekStart();
    const memberIds = assignments.map(a => a.memberId);

    // Get member details
    const members = await this.dataSource.query(`
      SELECT id, name, ea_number as "eaNumber", phone_number as "phoneNumber", branch_id as "branchId"
      FROM users WHERE id = ANY($1)
    `, [memberIds]);
    const memberMap = new Map(members.map((m: any) => [m.id, m]));

    // Get this week's follow-ups
    const weekLogs = await this.followupRepo.findByLeaderAndWeek(leaderId, weekStart);
    const loggedMemberIds = new Set(weekLogs.map(l => l.memberId));

    return assignments.map(a => ({
      assignmentId: a.id,
      member: memberMap.get(a.memberId) || { id: a.memberId, name: `User #${a.memberId}` },
      notes: a.notes,
      followedUpThisWeek: loggedMemberIds.has(a.memberId),
      lastLog: weekLogs.find(l => l.memberId === a.memberId) || null,
    }));
  }

  async logFollowup(leaderId: number, data: { assignmentId: string; comment: string }): Promise<MinistryFollowupLog> {
    await this.assertIsLeader(leaderId);
    const assignment = await this.assignmentRepo.findById(data.assignmentId);
    if (!assignment) throw new NotFoundException('Assignment not found');
    if (assignment.leaderId !== leaderId) throw new BadRequestException('This assignment does not belong to you');

    const weekStart = this.getCurrentWeekStart();

    return this.followupRepo.create({
      assignmentId: data.assignmentId,
      leaderId,
      memberId: assignment.memberId,
      comment: data.comment,
      reachedOutAt: new Date(),
      weekStart,
    });
  }

  async getFollowupHistory(assignmentId: string, options: { page?: number; limit?: number } = {}): Promise<{ data: MinistryFollowupLog[]; total: number }> {
    const [data, total] = await this.followupRepo.findByAssignment(assignmentId, options);
    return { data, total };
  }

  // --- Admin: Reports ---

  async getWeeklyReport(options: { weekStart?: string; branchId?: number } = {}): Promise<{
    totalAssignments: number;
    followedUp: number;
    notFollowedUp: number;
    compliancePercent: number;
    leaders: any[];
  }> {
    const weekStart = options.weekStart || this.getCurrentWeekStart();
    const branchFilter = options.branchId ? `AND ma.branch_id = ${options.branchId}` : '';

    // Get all active assignments
    const assignments: any[] = await this.dataSource.query(`
      SELECT ma.id, ma.leader_id as "leaderId", ma.member_id as "memberId"
      FROM ministry_assignments ma
      WHERE ma.is_active = true AND ma.deleted_at IS NULL ${branchFilter}
    `);

    // Get follow-up logs for the week
    const logs: any[] = await this.dataSource.query(`
      SELECT DISTINCT leader_id as "leaderId", member_id as "memberId"
      FROM ministry_followup_logs
      WHERE week_start = $1 AND deleted_at IS NULL
    `, [weekStart]);

    const loggedPairs = new Set(logs.map(l => `${l.leaderId}-${l.memberId}`));

    const totalAssignments = assignments.length;
    const followedUp = assignments.filter(a => loggedPairs.has(`${a.leaderId}-${a.memberId}`)).length;
    const notFollowedUp = totalAssignments - followedUp;
    const compliancePercent = totalAssignments > 0 ? Math.round((followedUp / totalAssignments) * 100) : 0;

    // Group by leader
    const leaderMap = new Map<number, { total: number; done: number; pending: number }>();
    for (const a of assignments) {
      if (!leaderMap.has(a.leaderId)) leaderMap.set(a.leaderId, { total: 0, done: 0, pending: 0 });
      const entry = leaderMap.get(a.leaderId)!;
      entry.total++;
      if (loggedPairs.has(`${a.leaderId}-${a.memberId}`)) entry.done++;
      else entry.pending++;
    }

    // Enrich leaders with names
    const leaderIds = [...leaderMap.keys()];
    const leaderUsers = leaderIds.length > 0
      ? await this.dataSource.query(`SELECT id, name, ea_number as "eaNumber" FROM users WHERE id = ANY($1)`, [leaderIds])
      : [];
    const leaderNameMap = new Map(leaderUsers.map((u: any) => [u.id, u]));

    const leaders = [...leaderMap.entries()].map(([leaderId, stats]) => ({
      leader: leaderNameMap.get(leaderId) || { id: leaderId, name: `User #${leaderId}` },
      ...stats,
    }));

    return { totalAssignments, followedUp, notFollowedUp, compliancePercent, leaders };
  }

  async getLeadersNotFollowedUp(options: { weekStart?: string; branchId?: number } = {}): Promise<any[]> {
    const weekStart = options.weekStart || this.getCurrentWeekStart();
    const branchFilter = options.branchId ? `AND ma.branch_id = ${options.branchId}` : '';

    const result = await this.dataSource.query(`
      SELECT
        ma.id as "assignmentId",
        ma.leader_id as "leaderId",
        ma.member_id as "memberId",
        ul.name as "leaderName",
        ul.ea_number as "leaderEaNumber",
        um.name as "memberName",
        um.ea_number as "memberEaNumber",
        um.phone_number as "memberPhone"
      FROM ministry_assignments ma
      JOIN users ul ON ul.id = ma.leader_id
      JOIN users um ON um.id = ma.member_id
      WHERE ma.is_active = true AND ma.deleted_at IS NULL ${branchFilter}
        AND NOT EXISTS (
          SELECT 1 FROM ministry_followup_logs fl
          WHERE fl.assignment_id = ma.id
            AND fl.week_start = $1
            AND fl.deleted_at IS NULL
        )
      ORDER BY ul.name, um.name
    `, [weekStart]);

    return result;
  }

  async exportCsv(options: { weekStart?: string; branchId?: number } = {}): Promise<string> {
    const weekStart = options.weekStart || this.getCurrentWeekStart();
    const notFollowedUp = await this.getLeadersNotFollowedUp(options);

    const allLogs: any[] = await this.dataSource.query(`
      SELECT
        fl.comment,
        fl.reached_out_at as "reachedOutAt",
        ul.name as "leaderName",
        ul.ea_number as "leaderEaNumber",
        um.name as "memberName",
        um.ea_number as "memberEaNumber"
      FROM ministry_followup_logs fl
      JOIN users ul ON ul.id = fl.leader_id
      JOIN users um ON um.id = fl.member_id
      WHERE fl.week_start = $1 AND fl.deleted_at IS NULL
      ORDER BY fl.reached_out_at DESC
    `, [weekStart]);

    const headers = ['Leader', 'Leader EA', 'Member', 'Member EA', 'Status', 'Comment', 'Reached Out At'];
    const rows: string[][] = [];

    for (const log of allLogs) {
      rows.push([log.leaderName, log.leaderEaNumber || '', log.memberName, log.memberEaNumber || '', 'Done', log.comment, new Date(log.reachedOutAt).toISOString()]);
    }
    for (const nf of notFollowedUp) {
      rows.push([nf.leaderName, nf.leaderEaNumber || '', nf.memberName, nf.memberEaNumber || '', 'Not done', '', '']);
    }

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    return csv;
  }

  // --- Leader: Weekly report submission ---

  async submitWeeklyReport(leaderId: number, data: {
    report: string;
    challenges?: string;
    prayerPoints?: string;
    branchId?: number;
  }): Promise<MinistryWeeklyReport> {
    await this.assertIsLeader(leaderId);
    const strippedReport = data.report.replace(/<[^>]*>/g, '').trim();
    if (!strippedReport) {
      throw new BadRequestException('Report cannot be empty');
    }

    const weekStart = this.getCurrentWeekStart();

    const existing = await this.weeklyReportRepo.findByLeaderAndWeek(leaderId, weekStart);
    if (existing) {
      throw new BadRequestException('You have already submitted a report for this week');
    }

    return this.weeklyReportRepo.create({
      leaderId,
      weekStart,
      report: data.report,
      challenges: data.challenges || null,
      prayerPoints: data.prayerPoints || null,
      branchId: data.branchId || null,
    });
  }

  async getMyWeeklyReport(leaderId: number): Promise<MinistryWeeklyReport | null> {
    const weekStart = this.getCurrentWeekStart();
    return this.weeklyReportRepo.findByLeaderAndWeek(leaderId, weekStart);
  }

  async getMyPastReports(leaderId: number, options: { page?: number; limit?: number } = {}): Promise<{ data: MinistryWeeklyReport[]; total: number }> {
    const [data, total] = await this.weeklyReportRepo.findByLeader(leaderId, options);
    return { data, total };
  }

  // --- Admin: View weekly reports ---

  async getWeeklyReports(options: { weekStart?: string; page?: number; limit?: number } = {}): Promise<{ data: any[]; total: number }> {
    const weekStart = options.weekStart || this.getCurrentWeekStart();

    const reports = await this.weeklyReportRepo.findByWeek(weekStart);

    if (reports.length === 0) return { data: [], total: 0 };

    const leaderIds = [...new Set(reports.map(r => r.leaderId))];
    const leaders = await this.dataSource.query(
      `SELECT id, name, ea_number as "eaNumber", branch_id as "branchId" FROM users WHERE id = ANY($1)`,
      [leaderIds],
    );
    const leaderMap = new Map(leaders.map((u: any) => [u.id, u]));

    const data = reports.map(r => ({
      ...r,
      leader: leaderMap.get(r.leaderId) || { id: r.leaderId, name: `User #${r.leaderId}` },
    }));

    return { data, total: reports.length };
  }

  async getLeadersWithoutReport(options: { weekStart?: string; branchId?: number } = {}): Promise<any[]> {
    const weekStart = options.weekStart || this.getCurrentWeekStart();
    const branchFilter = options.branchId ? `AND ma.branch_id = ${options.branchId}` : '';

    const result = await this.dataSource.query(`
      SELECT DISTINCT u.id as "userId", u.name, u.ea_number as "eaNumber", u.branch_id as "branchId"
      FROM ministry_assignments ma
      JOIN users u ON u.id = ma.leader_id
      WHERE ma.is_active = true AND ma.deleted_at IS NULL ${branchFilter}
        AND ma.leader_id NOT IN (
          SELECT wr.leader_id FROM ministry_weekly_reports wr
          WHERE wr.week_start = $1 AND wr.deleted_at IS NULL
        )
      ORDER BY u.name
    `, [weekStart]);

    return result;
  }
}
