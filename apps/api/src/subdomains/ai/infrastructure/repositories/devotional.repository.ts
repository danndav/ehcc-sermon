import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devotional } from '../../domain/entities/devotional.entity';

@Injectable()
export class DevotionalRepository {
  constructor(
    @InjectRepository(Devotional)
    private readonly repo: Repository<Devotional>,
  ) {}
}
