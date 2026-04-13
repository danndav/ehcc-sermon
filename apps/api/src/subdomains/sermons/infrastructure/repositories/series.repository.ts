import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from '../../domain/entities/series.entity';

@Injectable()
export class SeriesRepository {
  constructor(
    @InjectRepository(Series)
    private readonly repo: Repository<Series>,
  ) {}
}
