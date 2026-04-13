import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pastor } from '../../domain/entities/pastor.entity';

@Injectable()
export class PastorRepository {
  constructor(
    @InjectRepository(Pastor)
    private readonly repo: Repository<Pastor>,
  ) {}
}
