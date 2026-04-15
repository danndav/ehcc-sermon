import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MinistryFollowupLog } from '../../domain/entities/ministry-followup-log.entity';

@Injectable()
export class MinistryFollowupLogRepository {
  constructor(
    @InjectRepository(MinistryFollowupLog)
    private readonly repo: Repository<MinistryFollowupLog>,
  ) {}

  async create(log: Partial<MinistryFollowupLog>): Promise<MinistryFollowupLog> {
    return this.repo.save(log);
  }

  async findByAssignment(assignmentId: string, options: { page?: number; limit?: number } = {}): Promise<[MinistryFollowupLog[], number]> {
    const { page = 1, limit = 20 } = options;
    return this.repo.findAndCount({
      where: { assignmentId },
      order: { reachedOutAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByLeaderAndWeek(leaderId: number, weekStart: string): Promise<MinistryFollowupLog[]> {
    return this.repo.find({
      where: { leaderId, weekStart },
      order: { reachedOutAt: 'DESC' },
    });
  }

  async findByWeek(weekStart: string): Promise<MinistryFollowupLog[]> {
    return this.repo.find({
      where: { weekStart },
      order: { reachedOutAt: 'DESC' },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
