import { Injectable, NotFoundException } from '@nestjs/common';
import { PrayerRecordingRepository } from '../../infrastructure/repositories/prayer-recording.repository';
import { PrayerRecording } from '../../domain/entities/prayer-recording.entity';

@Injectable()
export class PrayerRecordingService {
  constructor(private readonly prayerRecordingRepository: PrayerRecordingRepository) {}

  async findAll(page?: number, limit?: number) {
    const [data, total] = await this.prayerRecordingRepository.findAll(page, limit);
    return { data, total, page: page || 1, limit: limit || 20 };
  }

  async findById(id: string) {
    const recording = await this.prayerRecordingRepository.findById(id);
    if (!recording) {
      throw new NotFoundException('Prayer recording not found');
    }
    return recording;
  }

  async create(data: Partial<PrayerRecording>) {
    return this.prayerRecordingRepository.save(data);
  }

  async remove(id: string) {
    await this.findById(id); // Ensure it exists
    await this.prayerRecordingRepository.remove(id);
  }
}
