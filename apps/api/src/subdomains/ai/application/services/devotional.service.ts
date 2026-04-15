import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClaudeClient } from './claude.client';
import { DevotionalRepository } from '../../infrastructure/repositories/devotional.repository';

export interface DevotionalDay {
  day: number;
  title: string;
  passageFromSermon: string;
  reflection: string;
  prayerPrompt: string;
}

const SYSTEM_PROMPT = `You are a devotional generator for Enthronement House Christian Centre (EHCC).

Your job is to create a 5-day devotional plan based on a sermon transcript. Each day should:
- Have a clear title related to a theme from the sermon
- Include a direct passage/quote from the sermon (the pastor's actual words)
- Provide a short reflection (2-3 sentences) that helps the reader meditate on that passage
- End with a prayer prompt

STRICT RULES:
- ONLY use content from the provided sermon transcript
- Every "passageFromSermon" must be an actual quote from the transcript
- Never add your own biblical interpretation — only reflect on what the pastor preached
- Keep each day's content concise and focused
- The 5 days should cover different themes/sections from the sermon`;

@Injectable()
export class DevotionalService {
  private readonly logger = new Logger(DevotionalService.name);

  constructor(
    private readonly claude: ClaudeClient,
    private readonly devotionalRepository: DevotionalRepository,
  ) {}

  async generate(sermonId: string, userId: string, transcriptText: string, sermonTitle: string): Promise<DevotionalDay[]> {
    this.logger.log(`Generating devotional for sermon ${sermonId}, user ${userId}`);

    const truncated = transcriptText.length > 40000
      ? transcriptText.substring(0, 40000) + '\n\n[Transcript truncated]'
      : transcriptText;

    const days = await this.claude.chatJson<DevotionalDay[]>({
      system: SYSTEM_PROMPT,
      userMessage: `Generate a 5-day devotional plan from this sermon.

Sermon title: "${sermonTitle}"

TRANSCRIPT:
${truncated}

Return a JSON array of 5 objects, each with: day (1-5), title, passageFromSermon, reflection, prayerPrompt.`,
      maxTokens: 3000,
    });

    // Save to database
    const saved = await this.devotionalRepository.save({
      userId,
      sermonId,
      contentJson: days,
    });

    this.logger.log(`Devotional generated and saved: ${saved.id}`);
    return days;
  }

  async findByUser(userId: string): Promise<any[]> {
    return this.devotionalRepository.findByUserId(userId);
  }

  async findByUserAndSermon(userId: string, sermonId: string): Promise<any> {
    const devotional = await this.devotionalRepository.findByUserAndSermon(userId, sermonId);
    if (!devotional) throw new NotFoundException('Devotional not found');
    return devotional;
  }
}
