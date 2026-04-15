import Anthropic from '@anthropic-ai/sdk';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ClaudeClient implements OnModuleInit {
  private readonly logger = new Logger(ClaudeClient.name);
  private client: Anthropic;

  onModuleInit() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async chat(options: {
    system: string;
    userMessage: string;
    maxTokens?: number;
  }): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens || 2048,
      system: options.system,
      messages: [{ role: 'user', content: options.userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock?.text || '';
  }

  async chatJson<T>(options: {
    system: string;
    userMessage: string;
    maxTokens?: number;
  }): Promise<T> {
    const text = await this.chat({
      ...options,
      system: options.system + '\n\nRespond ONLY with valid JSON. No markdown, no code fences, no explanation.',
    });

    // Strip potential markdown fences
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
