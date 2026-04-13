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
}
