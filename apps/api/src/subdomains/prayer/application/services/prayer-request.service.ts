import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrayerRequestRepository } from '../../infrastructure/repositories/prayer-request.repository';
import { PrayerAgreementRepository } from '../../infrastructure/repositories/prayer-agreement.repository';
import { PrayerCategoryEnum } from '../../domain/enums/prayer-category.enum';

@Injectable()
export class PrayerRequestService {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
    private readonly prayerAgreementRepository: PrayerAgreementRepository,
  ) {}

  async getPublicWall(category?: string, page?: number, limit?: number) {
    const [data, total] = await this.prayerRequestRepository.findPublic({
      category,
      page,
      limit,
    });
    return { data, total, page: page || 1, limit: limit || 20 };
  }

  async getPrivateRequests(page?: number, limit?: number) {
    const [data, total] = await this.prayerRequestRepository.findPrivate(page, limit);
    return { data, total, page: page || 1, limit: limit || 20 };
  }

  async getAllRequests(page?: number, limit?: number) {
    const [data, total] = await this.prayerRequestRepository.findAll(page, limit);
    return { data, total, page: page || 1, limit: limit || 20 };
  }

  async getMyRequests(userId: string) {
    return this.prayerRequestRepository.findByUser(userId);
  }

  async findById(id: string) {
    const request = await this.prayerRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Prayer request not found');
    }
    return request;
  }

  async create(userId: string, content: string, category: PrayerCategoryEnum, isPublic: boolean) {
    return this.prayerRequestRepository.save({
      userId,
      content,
      category,
      isPublic,
    });
  }

  async update(id: string, data: Record<string, any>) {
    const existing = await this.findById(id);
    return this.prayerRequestRepository.save({ ...existing, ...data });
  }

  async prayFor(userId: string, requestId: string) {
    const request = await this.findById(requestId);

    // Check if user already prayed for this request
    const existing = await this.prayerAgreementRepository.findByUserAndRequest(userId, requestId);
    if (existing) {
      throw new BadRequestException('You have already prayed for this request');
    }

    // Create agreement and increment count
    await this.prayerAgreementRepository.save({
      userId,
      prayerRequestId: requestId,
    });
    await this.prayerRequestRepository.incrementPrayerCount(requestId);

    return { success: true, prayerCount: request.prayerCount + 1 };
  }

  async remove(id: string) {
    await this.findById(id); // Ensure it exists
    await this.prayerRequestRepository.remove(id);
  }
}
