import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ServiceNoteRepository } from '../../infrastructure/repositories/service-note.repository';
import { R2Client } from '../../../../aop/r2/r2.client';
import { ServiceNote } from '../../domain/entities/service-note.entity';
import { NoteProgrammeTypeEnum } from '../../domain/enums/note-programme-type.enum';
import { SubmissionTypeEnum } from '../../domain/enums/submission-type.enum';
import { WORKER_ROLES } from '../../../auth/domain/enums/role.enum';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class ServiceNoteService {
  private readonly logger = new Logger(ServiceNoteService.name);

  constructor(
    private readonly repo: ServiceNoteRepository,
    private readonly r2: R2Client,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Calculate the deadline for a given service date: next Sunday 07:00 UTC
   */
  private calculateDeadline(serviceDate: string): Date {
    const date = new Date(serviceDate);
    const dayOfWeek = date.getUTCDay(); // 0=Sun, 1=Mon, ...
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    const deadline = new Date(date);
    deadline.setUTCDate(deadline.getUTCDate() + daysUntilSunday);
    deadline.setUTCHours(7, 0, 0, 0);
    return deadline;
  }

  /**
   * Get the current week boundaries (Monday 00:00 UTC to Sunday 23:59 UTC)
   */
  private getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setUTCHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    sunday.setUTCHours(23, 59, 59, 999);
    return { start: monday, end: sunday };
  }

  async submitTypedNote(userId: number, data: {
    programmeType: NoteProgrammeTypeEnum;
    specialProgrammeName?: string;
    serviceDate: string;
    typedContent: string;
    branchId?: number;
  }): Promise<ServiceNote> {
    const strippedContent = (data.typedContent || '').replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      throw new BadRequestException('Typed content cannot be empty');
    }

    if (data.programmeType === NoteProgrammeTypeEnum.SPECIAL && !data.specialProgrammeName) {
      throw new BadRequestException('Special programme name is required for special programmes');
    }

    const existing = await this.repo.findDuplicate(userId, data.serviceDate, data.programmeType);
    if (existing) {
      throw new BadRequestException('You have already submitted a note for this service');
    }

    const deadline = this.calculateDeadline(data.serviceDate);
    const isLate = new Date() > deadline;

    return this.repo.create({
      userId,
      programmeType: data.programmeType,
      specialProgrammeName: data.specialProgrammeName || null,
      serviceDate: data.serviceDate,
      submissionType: SubmissionTypeEnum.TYPED,
      typedContent: data.typedContent,
      branchId: data.branchId || null,
      deadline,
      isLate,
    });
  }

  async submitUploadNote(userId: number, data: {
    programmeType: NoteProgrammeTypeEnum;
    specialProgrammeName?: string;
    serviceDate: string;
    branchId?: number;
  }, file: { buffer: Buffer; originalname: string; mimetype: string; size: number }): Promise<ServiceNote> {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed. Allowed: PDF, JPEG, PNG, HEIC, DOC, DOCX`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    if (data.programmeType === NoteProgrammeTypeEnum.SPECIAL && !data.specialProgrammeName) {
      throw new BadRequestException('Special programme name is required for special programmes');
    }

    const existing = await this.repo.findDuplicate(userId, data.serviceDate, data.programmeType);
    if (existing) {
      throw new BadRequestException('You have already submitted a note for this service');
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const r2Key = `service-notes/${userId}/${data.serviceDate}/${uuidv4()}.${ext}`;
    await this.r2.uploadFile(r2Key, file.buffer, file.mimetype);

    const deadline = this.calculateDeadline(data.serviceDate);
    const isLate = new Date() > deadline;

    return this.repo.create({
      userId,
      programmeType: data.programmeType,
      specialProgrammeName: data.specialProgrammeName || null,
      serviceDate: data.serviceDate,
      submissionType: SubmissionTypeEnum.UPLOAD,
      fileUrl: r2Key,
      fileName: file.originalname,
      fileType: file.mimetype,
      branchId: data.branchId || null,
      deadline,
      isLate,
    });
  }

  async getMySubmissions(userId: number, options: { page?: number; limit?: number } = {}): Promise<{ data: ServiceNote[]; total: number }> {
    const [data, total] = await this.repo.findByUser(userId, options);
    return { data, total };
  }

  async getMyCurrentWeek(userId: number): Promise<ServiceNote[]> {
    const { start, end } = this.getCurrentWeekRange();
    return this.repo.findByUserAndWeek(userId, start, end);
  }

  async deleteMySubmission(id: string, userId: number): Promise<void> {
    const note = await this.repo.findById(id);
    if (!note) throw new NotFoundException('Service note not found');
    if (note.userId !== userId) throw new BadRequestException('You can only delete your own submissions');

    if (note.fileUrl) {
      try {
        await this.r2.deleteFile(note.fileUrl);
      } catch (e) {
        this.logger.warn(`Failed to delete file from R2: ${note.fileUrl}`);
      }
    }

    await this.repo.softDelete(id);
  }

  // --- Admin methods ---

  async findAll(options: { programmeType?: NoteProgrammeTypeEnum; branchId?: number; page?: number; limit?: number } = {}): Promise<{ data: ServiceNote[]; total: number }> {
    const [data, total] = await this.repo.findAll(options);
    return { data, total };
  }

  async findById(id: string): Promise<ServiceNote> {
    const note = await this.repo.findById(id);
    if (!note) throw new NotFoundException('Service note not found');
    return note;
  }

  async adminDelete(id: string): Promise<void> {
    const note = await this.repo.findById(id);
    if (!note) throw new NotFoundException('Service note not found');

    if (note.fileUrl) {
      try {
        await this.r2.deleteFile(note.fileUrl);
      } catch (e) {
        this.logger.warn(`Failed to delete file from R2: ${note.fileUrl}`);
      }
    }

    await this.repo.softDelete(id);
  }

  async getWeeklyReport(options: { weekStart?: string; branchId?: number } = {}): Promise<{
    totalSubmissions: number;
    lateSubmissions: number;
    missingCount: number;
    compliancePercent: number;
    submissions: any[];
  }> {
    let start: Date;
    let end: Date;

    if (options.weekStart) {
      start = new Date(options.weekStart);
      end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 6);
      end.setUTCHours(23, 59, 59, 999);
    } else {
      const range = this.getCurrentWeekRange();
      start = range.start;
      end = range.end;
    }

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const branchFilter = options.branchId ? `AND u.branch_id = ${options.branchId}` : '';

    // Get submissions with user info
    const submissions = await this.dataSource.query(`
      SELECT sn.*, u.name as "userName", u.ea_number as "eaNumber", u.branch_id as "userBranchId"
      FROM service_notes sn
      JOIN users u ON u.id = sn.user_id
      WHERE sn.service_date BETWEEN $1 AND $2
        AND sn.deleted_at IS NULL
        ${branchFilter}
      ORDER BY sn.created_at DESC
    `, [startDate, endDate]);

    // Count workers
    const workerRolesStr = WORKER_ROLES.map(r => `'${r}'`).join(',');
    const [workerCount] = await this.dataSource.query(`
      SELECT COUNT(*) as total FROM users
      WHERE role IN (${workerRolesStr}) AND deleted_at IS NULL ${branchFilter}
    `);

    const totalWorkers = Number(workerCount.total);
    const totalSubmissions = submissions.length;
    const lateSubmissions = submissions.filter((s: any) => s.is_late).length;

    // Get unique submitters
    const submitterIds = new Set(submissions.map((s: any) => s.user_id));
    const missingCount = Math.max(0, totalWorkers - submitterIds.size);
    const compliancePercent = totalWorkers > 0 ? Math.round((submitterIds.size / totalWorkers) * 100) : 0;

    return { totalSubmissions, lateSubmissions, missingCount, compliancePercent, submissions };
  }

  async getMissingSubmissions(options: { weekStart?: string; branchId?: number } = {}): Promise<any[]> {
    let start: Date;
    let end: Date;

    if (options.weekStart) {
      start = new Date(options.weekStart);
      end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 6);
      end.setUTCHours(23, 59, 59, 999);
    } else {
      const range = this.getCurrentWeekRange();
      start = range.start;
      end = range.end;
    }

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const workerRolesStr = WORKER_ROLES.map(r => `'${r}'`).join(',');
    const branchFilter = options.branchId ? `AND u.branch_id = ${options.branchId}` : '';

    const missing = await this.dataSource.query(`
      SELECT u.id as "userId", u.name, u.ea_number as "eaNumber", u.branch_id as "branchId", u.role
      FROM users u
      WHERE u.role IN (${workerRolesStr})
        AND u.deleted_at IS NULL
        ${branchFilter}
        AND u.id NOT IN (
          SELECT DISTINCT sn.user_id FROM service_notes sn
          WHERE sn.service_date BETWEEN $1 AND $2
            AND sn.deleted_at IS NULL
        )
      ORDER BY u.name ASC
    `, [startDate, endDate]);

    // Check attendance for missing workers
    for (const worker of missing) {
      const [attendance] = await this.dataSource.query(`
        SELECT COUNT(*) as count FROM attendance
        WHERE user_id = $1
          AND clocked_in_at::date BETWEEN $2 AND $3
          AND deleted_at IS NULL
      `, [worker.userId, startDate, endDate]);
      worker.attendedInPerson = Number(attendance.count) > 0;
    }

    return missing;
  }

  async exportCsv(options: { weekStart?: string; branchId?: number } = {}): Promise<string> {
    const report = await this.getWeeklyReport(options);

    const headers = ['Name', 'EA Number', 'Programme', 'Service Date', 'Type', 'Submitted At', 'Late'];
    const rows = report.submissions.map((s: any) => [
      s.userName,
      s.eaNumber || '',
      s.programme_type,
      s.service_date,
      s.submission_type,
      new Date(s.created_at).toISOString(),
      s.is_late ? 'Yes' : 'No',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map((v: string) => `"${v}"`).join(','))].join('\n');
    return csv;
  }

  /**
   * Delete all service note files from R2 and soft-delete DB records.
   * Called every Sunday 07:00 UTC (8am WAT) by the cleanup cron job.
   */
  async weeklyCleanup(): Promise<void> {
    // Get all records that have uploaded files and haven't been cleaned up yet
    const notes: { id: string; file_url: string | null }[] = await this.dataSource.query(`
      SELECT id, file_url FROM service_notes
      WHERE deleted_at IS NULL
    `);

    let filesDeleted = 0;
    let recordsCleaned = 0;

    for (const note of notes) {
      // Delete file from R2 if it exists
      if (note.file_url) {
        try {
          await this.r2.deleteFile(note.file_url);
          filesDeleted++;
        } catch (e) {
          this.logger.warn(`Failed to delete R2 file: ${note.file_url}`);
        }
      }

      // Soft-delete the record
      await this.repo.softDelete(note.id);
      recordsCleaned++;
    }

    this.logger.log(`Weekly cleanup complete: ${filesDeleted} files deleted, ${recordsCleaned} records soft-deleted`);
  }
}
