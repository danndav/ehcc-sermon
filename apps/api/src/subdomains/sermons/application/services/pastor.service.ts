import { Injectable, NotFoundException } from '@nestjs/common';
import { PastorRepository } from '../../infrastructure/repositories/pastor.repository';
import { Pastor } from '../../domain/entities/pastor.entity';

@Injectable()
export class PastorService {
  constructor(private readonly pastorRepository: PastorRepository) {}

  async findAll(options: { branchId?: number } = {}): Promise<Pastor[]> {
    return this.pastorRepository.findAll(options);
  }

  async findById(id: string): Promise<Pastor> {
    const pastor = await this.pastorRepository.findById(id);
    if (!pastor) throw new NotFoundException(`Pastor with id ${id} not found`);
    return pastor;
  }

  async create(data: Partial<Pastor>): Promise<Pastor> {
    return this.pastorRepository.save(data);
  }

  async update(id: string, data: Partial<Pastor>): Promise<Pastor> {
    const pastor = await this.findById(id);
    return this.pastorRepository.save({ ...pastor, ...data });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.pastorRepository.remove(id);
  }
}
