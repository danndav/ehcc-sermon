import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../../domain/entities/branch.entity';

@Injectable()
export class BranchRepository {
  constructor(
    @InjectRepository(Branch)
    private readonly repo: Repository<Branch>,
  ) {}

  async findAll(): Promise<Branch[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<Branch | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Branch | null> {
    return this.repo.findOne({ where: { code } });
  }

  async findHeadquarters(): Promise<Branch | null> {
    return this.repo.findOne({ where: { code: 'HQ' } });
  }

  async create(data: Partial<Branch>): Promise<Branch> {
    const branch = this.repo.create(data);
    return this.repo.save(branch);
  }

  async update(id: number, data: Partial<Branch>): Promise<Branch | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }
}
