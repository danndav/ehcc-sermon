import { Injectable, Logger } from '@nestjs/common';
import { AssemblyAI, TranscriptUtterance } from 'assemblyai';

export interface TranscriptResult {
  text: string;
  utterances: { start: number; end: number; text: string; speaker?: string }[];
  durationMs: number;
}

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private client: AssemblyAI | null = null;

  private getClient(): AssemblyAI {
    if (!this.client) {
      const apiKey = process.env.ASSEMBLYAI_API_KEY;
      if (!apiKey) {
        throw new Error('ASSEMBLYAI_API_KEY not configured');
      }
      this.client = new AssemblyAI({ apiKey });
    }
    return this.client;
  }

  /**
   * Transcribe an audio/video file from a URL (R2 signed URL or public URL)
   * Returns full text + timestamped utterances
   */
  async transcribe(audioUrl: string): Promise<TranscriptResult> {
    this.logger.log(`Starting transcription for: ${audioUrl.substring(0, 80)}...`);

    const client = this.getClient();

    const transcript = await client.transcripts.transcribe({
      audio_url: audioUrl,
      speaker_labels: true,
      speech_models: ['universal-3-pro'] as any,
    });

    if (transcript.status === 'error') {
      this.logger.error(`Transcription failed: ${transcript.error}`);
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    const utterances = (transcript.utterances || []).map((u: TranscriptUtterance) => ({
      start: u.start,
      end: u.end,
      text: u.text,
      speaker: u.speaker,
    }));

    this.logger.log(`Transcription complete: ${utterances.length} utterances, ${transcript.text?.length || 0} chars`);

    return {
      text: transcript.text || '',
      utterances,
      durationMs: transcript.audio_duration ? transcript.audio_duration * 1000 : 0,
    };
  }

  /**
   * Transcribe from a URL and return just the text (for AI processing)
   */
  async transcribeToText(audioUrl: string): Promise<string> {
    const result = await this.transcribe(audioUrl);
    return result.text;
  }
}
