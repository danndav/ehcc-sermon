import { Injectable } from '@nestjs/common';
import { PastorRepository } from '../../infrastructure/repositories/pastor.repository';

@Injectable()
export class PastorService {
  constructor(private readonly pastorRepository: PastorRepository) {}
}
