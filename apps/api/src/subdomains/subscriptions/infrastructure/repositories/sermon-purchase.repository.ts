import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonPurchase } from '../../domain/entities/sermon-purchase.entity';

@Injectable()
export class SermonPurchaseRepository {
  constructor(
    @InjectRepository(SermonPurchase)
    private readonly repo: Repository<SermonPurchase>,
  ) {}
}
