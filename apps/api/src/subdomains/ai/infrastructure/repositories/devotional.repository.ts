import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devotional } from '../../domain/entities/devotional.entity';

@Injectable()
export class DevotionalRepository {
  constructor(
    @InjectRepository(Devotional)
    private readonly repo: Repository<Devotional>,
  ) {}

  async save(data: Partial<Devotional>): Promise<Devotional> {
    return this.repo.save(data);
  }

  async findByUserId(userId: string): Promise<Devotional[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndSermon(userId: string, sermonId: string): Promise<Devotional | null> {
    return this.repo.findOne({ where: { userId, sermonId } });
  }

  async findById(id: string): Promise<Devotional | null> {
    return this.repo.findOne({ where: { id } });
  }
}
