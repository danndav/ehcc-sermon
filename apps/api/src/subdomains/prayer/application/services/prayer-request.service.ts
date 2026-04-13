import { Injectable } from '@nestjs/common';
import { PrayerRequestRepository } from '../../infrastructure/repositories/prayer-request.repository';

@Injectable()
export class PrayerRequestService {
  constructor(private readonly prayerRequestRepository: PrayerRequestRepository) {}
}
