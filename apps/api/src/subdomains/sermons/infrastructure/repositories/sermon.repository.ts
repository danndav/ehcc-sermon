import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Sermon } from '../../domain/entities/sermon.entity';
import { SermonStatusEnum } from '../../domain/enums/sermon-status.enum';

@Injectable()
export class SermonRepository {
  constructor(
    @InjectRepository(Sermon)
    private readonly repo: Repository<Sermon>,
  ) {}

  async findPublished(options: { branchId?: number; pastorId?: string; seriesId?: string; page?: number; limit?: number }): Promise<[Sermon[], number]> {
    const { branchId, pastorId, seriesId, page = 1, limit = 20 } = options;
    const where: FindOptionsWhere<Sermon> = { status: SermonStatusEnum.PUBLISHED };
    if (branchId) where.branchId = branchId;
    if (pastorId) where.pastorId = pastorId;
    if (seriesId) where.seriesId = seriesId;
    return this.repo.findAndCount({
      where,
      order: { publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findAll(options: { branchId?: number; status?: SermonStatusEnum; page?: number; limit?: number }): Promise<[Sermon[], number]> {
    const { branchId, status, page = 1, limit = 20 } = options;
    const where: FindOptionsWhere<Sermon> = {};
    if (branchId) where.branchId = branchId;
    if (status) where.status = status;
    return this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Sermon | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(sermon: Partial<Sermon>): Promise<Sermon> {
    return this.repo.save(sermon);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'viewCount', 1);
  }
}
