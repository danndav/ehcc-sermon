import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PrayerRequest } from '../../domain/entities/prayer-request.entity';
import { PrayerCategoryEnum } from '../../domain/enums/prayer-category.enum';

@Injectable()
export class PrayerRequestRepository {
  constructor(
    @InjectRepository(PrayerRequest)
    private readonly repo: Repository<PrayerRequest>,
  ) {}

  async findPublic(options: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<[PrayerRequest[], number]> {
    const { category, page = 1, limit = 20 } = options;
    const where: FindOptionsWhere<PrayerRequest> = { isPublic: true };
    if (category && category !== PrayerCategoryEnum.ALL) {
      where.category = category as PrayerCategoryEnum;
    }
    return this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByUser(userId: string): Promise<PrayerRequest[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPrivate(page = 1, limit = 20): Promise<[PrayerRequest[], number]> {
    return this.repo.findAndCount({
      where: { isPublic: false },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findAll(page = 1, limit = 20): Promise<[PrayerRequest[], number]> {
    return this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<PrayerRequest | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(data: Partial<PrayerRequest>): Promise<PrayerRequest> {
    return this.repo.save(data);
  }

  async incrementPrayerCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'prayerCount', 1);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
