import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../domain/entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly repository: Repository<Attendance>,
  ) {}

  async findTodayByUser(userId: number): Promise<Attendance | null> {
    return this.repository
      .createQueryBuilder('a')
      .where('a.user_id = :userId', { userId })
      .andWhere('a.clocked_in_at::date = CURRENT_DATE')
      .andWhere('a.deleted_at IS NULL')
      .getOne();
  }

  async create(data: Partial<Attendance>): Promise<Attendance> {
    const record = this.repository.create(data);
    return this.repository.save(record);
  }

  async save(record: Attendance): Promise<Attendance> {
    return this.repository.save(record);
  }

  async findByUser(userId: number, page = 1, limit = 20): Promise<[Attendance[], number]> {
    return this.repository.findAndCount({
      where: { userId },
      order: { clockedInAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findAll(page = 1, limit = 20): Promise<[Attendance[], number]> {
    return this.repository.findAndCount({
      order: { clockedInAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findTodayAll(): Promise<Attendance[]> {
    return this.repository
      .createQueryBuilder('a')
      .where('a.clocked_in_at::date = CURRENT_DATE')
      .andWhere('a.deleted_at IS NULL')
      .orderBy('a.clocked_in_at', 'DESC')
      .getMany();
  }
}
