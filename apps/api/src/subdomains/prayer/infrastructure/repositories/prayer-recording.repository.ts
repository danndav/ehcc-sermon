import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerRecording } from '../../domain/entities/prayer-recording.entity';

@Injectable()
export class PrayerRecordingRepository {
  constructor(
    @InjectRepository(PrayerRecording)
    private readonly repo: Repository<PrayerRecording>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<[PrayerRecording[], number]> {
    return this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<PrayerRecording | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(data: Partial<PrayerRecording>): Promise<PrayerRecording> {
    return this.repo.save(data);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
