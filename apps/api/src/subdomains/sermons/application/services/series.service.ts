import { Injectable, NotFoundException } from '@nestjs/common';
import { SeriesRepository } from '../../infrastructure/repositories/series.repository';
import { Series } from '../../domain/entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(private readonly seriesRepository: SeriesRepository) {}

  async findActive(options: { branchId?: number } = {}): Promise<Series[]> {
    return this.seriesRepository.findActive(options);
  }

  async findAll(options: { branchId?: number } = {}): Promise<Series[]> {
    return this.seriesRepository.findAll(options);
  }

  async findById(id: string): Promise<Series> {
    const series = await this.seriesRepository.findById(id);
    if (!series) throw new NotFoundException(`Series with id ${id} not found`);
    return series;
  }

  async create(data: Partial<Series>): Promise<Series> {
    return this.seriesRepository.save(data);
  }

  async update(id: string, data: Partial<Series>): Promise<Series> {
    const series = await this.findById(id);
    return this.seriesRepository.save({ ...series, ...data });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.seriesRepository.remove(id);
  }
}
