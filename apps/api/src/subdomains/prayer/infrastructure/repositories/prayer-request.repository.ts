import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerRequest } from '../../domain/entities/prayer-request.entity';

@Injectable()
export class PrayerRequestRepository {
  constructor(
    @InjectRepository(PrayerRequest)
    private readonly repo: Repository<PrayerRequest>,
  ) {}
}
