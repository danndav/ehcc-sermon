import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchHistory } from '../../domain/entities/watch-history.entity';

@Injectable()
export class WatchHistoryRepository {
  constructor(
    @InjectRepository(WatchHistory)
    private readonly repo: Repository<WatchHistory>,
  ) {}

  async findByUserAndSermon(userId: string, sermonId: string): Promise<WatchHistory | null> {
    return this.repo.findOne({ where: { userId, sermonId } });
  }

  async findByUser(userId: string, options: { page?: number; limit?: number } = {}): Promise<[WatchHistory[], number]> {
    const { page = 1, limit = 20 } = options;
    return this.repo.findAndCount({
      where: { userId },
      order: { lastWatchedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findContinueWatching(userId: string, limit: number = 10): Promise<WatchHistory[]> {
    return this.repo.find({
      where: { userId, completed: false },
      order: { lastWatchedAt: 'DESC' },
      take: limit,
    });
  }

  async upsert(userId: string, sermonId: string, progressSeconds: number, completed: boolean): Promise<WatchHistory> {
    const existing = await this.findByUserAndSermon(userId, sermonId);
    if (existing) {
      existing.progressSeconds = progressSeconds;
      existing.completed = completed;
      existing.lastWatchedAt = new Date();
      return this.repo.save(existing);
    }
    return this.repo.save({
      userId,
      sermonId,
      progressSeconds,
      completed,
      lastWatchedAt: new Date(),
    });
  }
}
