import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sermon } from '../../domain/entities/sermon.entity';

@Injectable()
export class SermonRepository {
  constructor(
    @InjectRepository(Sermon)
    private readonly repo: Repository<Sermon>,
  ) {}
}
