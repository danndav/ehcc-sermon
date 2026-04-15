import { Injectable, NotFoundException } from '@nestjs/common';
import { VerseRepository } from '../../infrastructure/repositories/verse.repository';
import { Verse, VerseTypeEnum } from '../../domain/entities/verse.entity';

@Injectable()
export class VerseService {
  constructor(private readonly verseRepository: VerseRepository) {}

  async findCurrent(type: VerseTypeEnum, branchId?: number): Promise<Verse | null> {
    return this.verseRepository.findCurrent(type, branchId);
  }

  async findAll(type?: VerseTypeEnum): Promise<Verse[]> {
    return this.verseRepository.findAll(type);
  }

  async findById(id: string): Promise<Verse> {
    const verse = await this.verseRepository.findById(id);
    if (!verse) throw new NotFoundException(`Verse with id ${id} not found`);
    return verse;
  }

  async create(data: Partial<Verse>): Promise<Verse> {
    return this.verseRepository.save(data);
  }

  async update(id: string, data: Partial<Verse>): Promise<Verse> {
    const verse = await this.findById(id);
    return this.verseRepository.save({ ...verse, ...data });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.verseRepository.remove(id);
  }
}
