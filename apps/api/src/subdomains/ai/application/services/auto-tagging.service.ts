import { Injectable, Logger } from '@nestjs/common';
import { ClaudeClient } from './claude.client';

export interface AutoTagResult {
  summary: string;
  tags: string[];
  suggestedTitle: string;
  keyPoints: string[];
}

const SYSTEM_PROMPT = `You are an AI assistant for Enthronement House Christian Centre (EHCC), a church led by Rev Deji Olabode.

Your ONLY job is to analyze sermon transcripts and generate metadata. You must:
- Generate a concise summary (2-3 sentences) of what the pastor preached
- Extract 5-10 topic tags relevant to the sermon content
- Suggest a clear sermon title if not obvious
- List 3-5 key points from the sermon

RULES:
- Only reference what the pastor actually said in the transcript
- Never add your own spiritual advice or theological opinion
- Tags should be simple topic words (Faith, Prayer, Marriage, Finances, Healing, etc.)
- Keep the summary factual — what the pastor taught, not your interpretation`;

@Injectable()
export class AutoTaggingService {
  private readonly logger = new Logger(AutoTaggingService.name);

  constructor(private readonly claude: ClaudeClient) {}

  async generateTags(transcriptText: string, existingTitle?: string): Promise<AutoTagResult> {
    this.logger.log(`Generating auto-tags for transcript (${transcriptText.length} chars)`);

    const truncated = transcriptText.length > 50000
      ? transcriptText.substring(0, 50000) + '\n\n[Transcript truncated]'
      : transcriptText;

    const result = await this.claude.chatJson<AutoTagResult>({
      system: SYSTEM_PROMPT,
      userMessage: `Analyze this sermon transcript and return JSON with: summary, tags (array of strings), suggestedTitle, keyPoints (array of strings).

${existingTitle ? `Current title: "${existingTitle}"` : 'No title provided.'}

TRANSCRIPT:
${truncated}`,
      maxTokens: 1024,
    });

    this.logger.log(`Auto-tagging complete: ${result.tags.length} tags`);
    return result;
  }
}
