import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}
}
