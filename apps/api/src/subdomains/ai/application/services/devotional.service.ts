import { Injectable } from '@nestjs/common';
import { DevotionalRepository } from '../../infrastructure/repositories/devotional.repository';

@Injectable()
export class DevotionalService {
  constructor(private readonly devotionalRepository: DevotionalRepository) {}
  // Generate 5-day devotional plan from sermon transcript via Claude API
}
