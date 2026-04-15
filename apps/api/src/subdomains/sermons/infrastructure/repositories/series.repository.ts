import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Series } from '../../domain/entities/series.entity';

@Injectable()
export class SeriesRepository {
  constructor(
    @InjectRepository(Series)
    private readonly repo: Repository<Series>,
  ) {}

  async findActive(options: { branchId?: number } = {}): Promise<Series[]> {
    const where: FindOptionsWhere<Series> = { isActive: true };
    if (options.branchId) where.branchId = options.branchId;

    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Series | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(options: { branchId?: number } = {}): Promise<Series[]> {
    const where: FindOptionsWhere<Series> = {};
    if (options.branchId) where.branchId = options.branchId;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async save(series: Partial<Series>): Promise<Series> {
    return this.repo.save(series);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
