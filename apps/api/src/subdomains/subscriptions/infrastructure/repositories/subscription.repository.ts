import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../domain/entities/subscription.entity';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
  ) {}
}
