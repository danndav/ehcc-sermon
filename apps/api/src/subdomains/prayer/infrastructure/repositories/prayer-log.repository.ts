import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerLog } from '../../domain/entities/prayer-log.entity';

@Injectable()
export class PrayerLogRepository {
  constructor(
    @InjectRepository(PrayerLog)
    private readonly repo: Repository<PrayerLog>,
  ) {}

  async createMany(logs: Partial<PrayerLog>[]): Promise<PrayerLog[]> {
    const entities = this.repo.create(logs);
    return this.repo.save(entities);
  }

  async findByUser(userId: number, page = 1, limit = 20): Promise<[PrayerLog[], number]> {
    return this.repo.findAndCount({
      where: { userId },
      order: { loggedDate: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByUserToday(userId: number): Promise<PrayerLog[]> {
    return this.repo.createQueryBuilder('pl')
      .where('pl.user_id = :userId', { userId })
      .andWhere('pl.logged_date = CURRENT_DATE')
      .andWhere('pl.deleted_at IS NULL')
      .orderBy('pl.created_at', 'DESC')
      .getMany();
  }

  async findAll(page = 1, limit = 50): Promise<[PrayerLog[], number]> {
    return this.repo.findAndCount({
      order: { loggedDate: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getTotalMinutesByUser(userId: number): Promise<number> {
    const result = await this.repo.createQueryBuilder('pl')
      .select('COALESCE(SUM(pl.duration_minutes), 0)', 'total')
      .where('pl.user_id = :userId', { userId })
      .andWhere('pl.deleted_at IS NULL')
      .getRawOne();
    return Number(result.total);
  }
}
