import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from '../../infrastructure/repositories/branch.repository';
import { BranchFactory } from '../factories/branch.factory';
import { BranchReadModel } from '../../domain/read-models/branch.read-model';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  async findAll(): Promise<BranchReadModel[]> {
    const branches = await this.branchRepository.findAll();
    return branches.map(BranchFactory.toReadModel);
  }

  async findById(id: number): Promise<BranchReadModel> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return BranchFactory.toReadModel(branch);
  }

  async findHeadquarters(): Promise<BranchReadModel> {
    const branch = await this.branchRepository.findHeadquarters();
    if (!branch) {
      throw new NotFoundException('Headquarters branch not found');
    }
    return BranchFactory.toReadModel(branch);
  }

  async create(data: { code: string; name: string; location?: string; country?: string; state?: string; city?: string; isActive?: boolean }): Promise<BranchReadModel> {
    const existing = await this.branchRepository.findByCode(data.code);
    if (existing) {
      throw new BadRequestException(`Branch with code "${data.code}" already exists`);
    }
    const branch = await this.branchRepository.create({
      ...data,
      isActive: data.isActive ?? true,
    });
    return BranchFactory.toReadModel(branch);
  }

  async update(id: number, data: { code?: string; name?: string; location?: string; country?: string; state?: string; city?: string; isActive?: boolean }): Promise<BranchReadModel> {
    const existing = await this.branchRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    if (data.code && data.code !== existing.code) {
      const duplicate = await this.branchRepository.findByCode(data.code);
      if (duplicate) {
        throw new BadRequestException(`Branch with code "${data.code}" already exists`);
      }
    }
    const updated = await this.branchRepository.update(id, data);
    return BranchFactory.toReadModel(updated!);
  }
}
