import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinistryWeeklyReport } from '../../domain/entities/ministry-weekly-report.entity';

@Injectable()
export class MinistryWeeklyReportRepository {
  constructor(
    @InjectRepository(MinistryWeeklyReport)
    private readonly repo: Repository<MinistryWeeklyReport>,
  ) {}

  async create(report: Partial<MinistryWeeklyReport>): Promise<MinistryWeeklyReport> {
    return this.repo.save(report);
  }

  async findByLeaderAndWeek(leaderId: number, weekStart: string): Promise<MinistryWeeklyReport | null> {
    return this.repo.findOne({ where: { leaderId, weekStart } });
  }

  async findByLeader(leaderId: number, options: { page?: number; limit?: number } = {}): Promise<[MinistryWeeklyReport[], number]> {
    const { page = 1, limit = 20 } = options;
    return this.repo.findAndCount({
      where: { leaderId },
      order: { weekStart: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByWeek(weekStart: string): Promise<MinistryWeeklyReport[]> {
    return this.repo.find({
      where: { weekStart },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(options: { page?: number; limit?: number } = {}): Promise<[MinistryWeeklyReport[], number]> {
    const { page = 1, limit = 50 } = options;
    return this.repo.findAndCount({
      order: { weekStart: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
