import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { ServiceNote } from '../../domain/entities/service-note.entity';
import { NoteProgrammeTypeEnum } from '../../domain/enums/note-programme-type.enum';

@Injectable()
export class ServiceNoteRepository {
  constructor(
    @InjectRepository(ServiceNote)
    private readonly repo: Repository<ServiceNote>,
  ) {}

  async create(note: Partial<ServiceNote>): Promise<ServiceNote> {
    return this.repo.save(note);
  }

  async findById(id: string): Promise<ServiceNote | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUser(userId: number, options: { page?: number; limit?: number } = {}): Promise<[ServiceNote[], number]> {
    const { page = 1, limit = 20 } = options;
    return this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findByUserAndWeek(userId: number, weekStart: Date, weekEnd: Date): Promise<ServiceNote[]> {
    return this.repo.find({
      where: {
        userId,
        serviceDate: Between(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]) as any,
      },
      order: { serviceDate: 'ASC' },
    });
  }

  async findDuplicate(userId: number, serviceDate: string, programmeType: NoteProgrammeTypeEnum): Promise<ServiceNote | null> {
    return this.repo.findOne({
      where: { userId, serviceDate, programmeType },
    });
  }

  async findByWeek(
    weekStart: Date,
    weekEnd: Date,
    options: { programmeType?: NoteProgrammeTypeEnum; branchId?: number; page?: number; limit?: number } = {},
  ): Promise<[ServiceNote[], number]> {
    const { programmeType, branchId, page = 1, limit = 50 } = options;
    const where: FindOptionsWhere<ServiceNote> = {
      serviceDate: Between(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]) as any,
    };
    if (programmeType) where.programmeType = programmeType;
    if (branchId) where.branchId = branchId;
    return this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findAll(options: { programmeType?: NoteProgrammeTypeEnum; branchId?: number; page?: number; limit?: number } = {}): Promise<[ServiceNote[], number]> {
    const { programmeType, branchId, page = 1, limit = 50 } = options;
    const where: FindOptionsWhere<ServiceNote> = {};
    if (programmeType) where.programmeType = programmeType;
    if (branchId) where.branchId = branchId;
    return this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async countByWeek(weekStart: Date, weekEnd: Date): Promise<{ total: number; late: number }> {
    const startDate = weekStart.toISOString().split('T')[0];
    const endDate = weekEnd.toISOString().split('T')[0];

    const total = await this.repo.count({
      where: {
        serviceDate: Between(startDate, endDate) as any,
      },
    });

    const late = await this.repo.count({
      where: {
        serviceDate: Between(startDate, endDate) as any,
        isLate: true,
      },
    });

    return { total, late };
  }
}
