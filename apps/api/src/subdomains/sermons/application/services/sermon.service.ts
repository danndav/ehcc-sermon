import { Injectable, NotFoundException } from '@nestjs/common';
import { SermonRepository } from '../../infrastructure/repositories/sermon.repository';
import { WatchHistoryRepository } from '../../infrastructure/repositories/watch-history.repository';
import { Sermon } from '../../domain/entities/sermon.entity';
import { SermonStatusEnum } from '../../domain/enums/sermon-status.enum';

@Injectable()
export class SermonService {
  constructor(
    private readonly sermonRepository: SermonRepository,
    private readonly watchHistoryRepository: WatchHistoryRepository,
  ) {}

  async findPublished(options: { branchId?: number; pastorId?: string; seriesId?: string; page?: number; limit?: number }): Promise<{ data: Sermon[]; total: number }> {
    const [data, total] = await this.sermonRepository.findPublished(options);
    return { data, total };
  }

  async findAll(options: { branchId?: number; status?: SermonStatusEnum; page?: number; limit?: number }): Promise<{ data: Sermon[]; total: number }> {
    const [data, total] = await this.sermonRepository.findAll(options);
    return { data, total };
  }

  async findById(id: string): Promise<Sermon> {
    const sermon = await this.sermonRepository.findById(id);
    if (!sermon) throw new NotFoundException(`Sermon with id ${id} not found`);
    return sermon;
  }

  async create(data: Partial<Sermon>): Promise<Sermon> {
    if (data.status === SermonStatusEnum.PUBLISHED && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    return this.sermonRepository.save(data);
  }

  async update(id: string, data: Partial<Sermon>): Promise<Sermon> {
    const sermon = await this.findById(id);
    return this.sermonRepository.save({ ...sermon, ...data });
  }

  async publish(id: string): Promise<Sermon> {
    const sermon = await this.findById(id);
    return this.sermonRepository.save({
      ...sermon,
      status: SermonStatusEnum.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  async unpublish(id: string): Promise<Sermon> {
    const sermon = await this.findById(id);
    return this.sermonRepository.save({
      ...sermon,
      status: SermonStatusEnum.DRAFT,
      publishedAt: null,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.sermonRepository.remove(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.sermonRepository.incrementViewCount(id);
  }

  async recordUniqueView(sermonId: string, userId: string): Promise<boolean> {
    const existing = await this.watchHistoryRepository.findByUserAndSermon(userId, sermonId);
    if (existing) {
      return false; // Already viewed, don't increment
    }
    await this.sermonRepository.incrementViewCount(sermonId);
    await this.watchHistoryRepository.upsert(userId, sermonId, 0, false);
    return true;
  }
}
