import { Injectable, Logger } from '@nestjs/common';
import { ClaudeClient } from './claude.client';
import { EmbeddingService } from './embedding.service';

export interface GuidanceResult {
  response: string;
  sermons: { sermonId: string; title: string; summary: string | null }[];
}

const SYSTEM_PROMPT = `You are a sermon recommendation assistant for Enthronement House Christian Centre (EHCC), led by Rev Deji Olabode.

A church member is sharing what they are going through. Your job is to recommend relevant sermons from the church library that speak to their situation.

STRICT RULES:
- You must ONLY recommend sermons that were provided to you in the context
- NEVER give your own spiritual advice, biblical interpretation, or theological opinion
- NEVER quote Bible verses yourself — only reference what the pastor said in sermons
- Always attribute content to the pastor who preached it
- If no sermons match the query, respond exactly: "We don't have a sermon on that topic yet — check back soon."
- Be warm, empathetic, and brief (2-4 sentences introducing the recommendations)
- Format your response as a short encouraging message followed by the sermon recommendations`;

@Injectable()
export class GuidanceService {
  private readonly logger = new Logger(GuidanceService.name);

  constructor(
    private readonly claude: ClaudeClient,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async getGuidance(userMessage: string): Promise<GuidanceResult> {
    this.logger.log(`Guidance request: "${userMessage.substring(0, 100)}..."`);

    // Step 1: Find matching sermons
    const matchingSermons = await this.embeddingService.searchSermons(userMessage, 5);

    if (matchingSermons.length === 0) {
      return {
        response: "We don't have a sermon on that topic yet — check back soon.",
        sermons: [],
      };
    }

    // Step 2: Build context from matching sermons
    const sermonContext = matchingSermons
      .map((s, i) => `${i + 1}. "${s.title}" — ${s.summary || 'No summary available'}`)
      .join('\n');

    // Step 3: Ask Claude to generate a warm response
    const response = await this.claude.chat({
      system: SYSTEM_PROMPT,
      userMessage: `The member says: "${userMessage}"

Here are the matching sermons from our library:
${sermonContext}

Write a warm, brief response recommending these sermons. Reference specific sermon titles and what they cover.`,
      maxTokens: 512,
    });

    return {
      response,
      sermons: matchingSermons.map((s) => ({
        sermonId: s.sermonId,
        title: s.title,
        summary: s.summary,
      })),
    };
  }
}
