import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { VideoProject, VideoStatusEnum } from '../../domain/entities/video-project.entity';

@Injectable()
export class VideoProjectRepository {
  constructor(
    @InjectRepository(VideoProject)
    private readonly repo: Repository<VideoProject>,
  ) {}

  async findBySermonId(sermonId: string): Promise<VideoProject | null> {
    return this.repo.findOne({ where: { sermonId } });
  }

  async findById(id: string): Promise<VideoProject | null> {
    return this.repo.findOne({ where: { id } });
  }

  async save(data: Partial<VideoProject>): Promise<VideoProject> {
    return this.repo.save(data);
  }

  async findStaleRawFiles(olderThanDays: number): Promise<VideoProject[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    return this.repo.find({
      where: {
        status: VideoStatusEnum.READY,
        rawDeleted: false,
        createdAt: LessThan(cutoff),
      },
    });
  }

  async findAll(options: { page?: number; limit?: number } = {}): Promise<[VideoProject[], number]> {
    const { page = 1, limit = 20 } = options;
    return this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
