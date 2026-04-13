import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountCode } from '../../domain/entities/discount-code.entity';

@Injectable()
export class DiscountCodeRepository {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly repo: Repository<DiscountCode>,
  ) {}
}
