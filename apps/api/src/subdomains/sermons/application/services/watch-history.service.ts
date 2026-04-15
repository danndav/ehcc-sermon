import { Injectable } from '@nestjs/common';
import { WatchHistoryRepository } from '../../infrastructure/repositories/watch-history.repository';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly watchHistoryRepository: WatchHistoryRepository) {}

  async saveProgress(userId: string, sermonId: string, progressSeconds: number, completed: boolean) {
    return this.watchHistoryRepository.upsert(userId, sermonId, progressSeconds, completed);
  }

  async getProgress(userId: string, sermonId: string) {
    return this.watchHistoryRepository.findByUserAndSermon(userId, sermonId);
  }

  async getHistory(userId: string, options?: { page?: number; limit?: number }) {
    const [data, total] = await this.watchHistoryRepository.findByUser(userId, options);
    return { data, total };
  }

  async getContinueWatching(userId: string) {
    return this.watchHistoryRepository.findContinueWatching(userId);
  }
}
