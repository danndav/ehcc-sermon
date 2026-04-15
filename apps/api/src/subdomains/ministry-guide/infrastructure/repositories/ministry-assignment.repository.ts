import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MinistryAssignment } from '../../domain/entities/ministry-assignment.entity';

@Injectable()
export class MinistryAssignmentRepository {
  constructor(
    @InjectRepository(MinistryAssignment)
    private readonly repo: Repository<MinistryAssignment>,
  ) {}

  async create(assignment: Partial<MinistryAssignment>): Promise<MinistryAssignment> {
    return this.repo.save(assignment);
  }

  async findById(id: string): Promise<MinistryAssignment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByLeader(leaderId: number): Promise<MinistryAssignment[]> {
    return this.repo.find({
      where: { leaderId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findByMember(memberId: number): Promise<MinistryAssignment | null> {
    return this.repo.findOne({ where: { memberId, isActive: true } });
  }

  async findAll(options: { branchId?: number; page?: number; limit?: number } = {}): Promise<[MinistryAssignment[], number]> {
    const { branchId, page = 1, limit = 50 } = options;
    const where: FindOptionsWhere<MinistryAssignment> = { isActive: true };
    if (branchId) where.branchId = branchId;
    return this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findDuplicate(leaderId: number, memberId: number): Promise<MinistryAssignment | null> {
    return this.repo.findOne({ where: { leaderId, memberId, isActive: true } });
  }

  async save(assignment: MinistryAssignment): Promise<MinistryAssignment> {
    return this.repo.save(assignment);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
