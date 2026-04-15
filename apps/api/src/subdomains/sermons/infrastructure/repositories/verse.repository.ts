import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Verse, VerseTypeEnum } from '../../domain/entities/verse.entity';

@Injectable()
export class VerseRepository {
  constructor(
    @InjectRepository(Verse)
    private readonly repo: Repository<Verse>,
  ) {}

  async findCurrent(type: VerseTypeEnum, branchId?: number): Promise<Verse | null> {
    const today = new Date().toISOString().split('T')[0];

    const qb = this.repo.createQueryBuilder('v')
      .where('v.type = :type', { type })
      .andWhere('v.is_active = true')
      .andWhere('v.start_date <= :today', { today })
      .andWhere('(v.end_date IS NULL OR v.end_date >= :today)', { today })
      .orderBy('v.start_date', 'DESC');

    if (branchId) {
      qb.andWhere('(v.branch_id = :branchId OR v.branch_id IS NULL)', { branchId });
    }

    return qb.getOne();
  }

  async findAll(type?: VerseTypeEnum): Promise<Verse[]> {
    const qb = this.repo.createQueryBuilder('v')
      .orderBy('v.created_at', 'DESC');

    if (type) qb.where('v.type = :type', { type });

    return qb.getMany();
  }

  async findById(id: string): Promise<Verse | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(verse: Partial<Verse>): Promise<Verse> {
    return this.repo.save(verse);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
