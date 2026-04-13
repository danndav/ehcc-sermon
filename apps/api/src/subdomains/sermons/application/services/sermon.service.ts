import { Injectable } from '@nestjs/common';
import { SermonRepository } from '../../infrastructure/repositories/sermon.repository';

@Injectable()
export class SermonService {
  constructor(private readonly sermonRepository: SermonRepository) {}
}
