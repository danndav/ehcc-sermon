import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Pastor } from '../../domain/entities/pastor.entity';

@Injectable()
export class PastorRepository {
  constructor(
    @InjectRepository(Pastor)
    private readonly repo: Repository<Pastor>,
  ) {}

  async findAll(options: { branchId?: number } = {}): Promise<Pastor[]> {
    const where: FindOptionsWhere<Pastor> = {};
    if (options.branchId) where.branchId = options.branchId;

    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Pastor | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(pastor: Partial<Pastor>): Promise<Pastor> {
    return this.repo.save(pastor);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
