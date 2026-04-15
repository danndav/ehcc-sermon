import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerAgreement } from '../../domain/entities/prayer-agreement.entity';

@Injectable()
export class PrayerAgreementRepository {
  constructor(
    @InjectRepository(PrayerAgreement)
    private readonly repo: Repository<PrayerAgreement>,
  ) {}

  async findByUserAndRequest(userId: string, prayerRequestId: string): Promise<PrayerAgreement | null> {
    return this.repo.findOne({ where: { userId, prayerRequestId } });
  }

  async save(data: Partial<PrayerAgreement>): Promise<PrayerAgreement> {
    return this.repo.save(data);
  }
}
