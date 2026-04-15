import { Injectable, Logger } from '@nestjs/common';
import { R2Client } from '../../../../aop/r2/r2.client';
import { QueueService } from '../../../../aop/queue/services/queue.service';
import { TranscriptionService } from './transcription.service';
import { VideoProjectRepository } from '../../infrastructure/repositories/video-project.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class SermonTranscriptionService {
  private readonly logger = new Logger(SermonTranscriptionService.name);

  constructor(
    private readonly r2: R2Client,
    private readonly transcriptionService: TranscriptionService,
    private readonly videoProjectRepo: VideoProjectRepository,
    private readonly queue: QueueService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Full transcription flow:
   * 1. Get audio URL from R2
   * 2. Send to AssemblyAI
   * 3. Store transcript in sermon_metadata
   * 4. If auto_publish is true, publish the sermon
   * 5. Queue AI processing (embed, auto-tag)
   */
  async transcribeSermon(sermonId: string): Promise<{
    text: string;
    utterances: { start: number; end: number; text: string; speaker?: string }[];
    durationMs: number;
  }> {
    this.logger.log(`Starting transcription for sermon ${sermonId}`);

    // Get audio source — YouTube URL first (fastest), then R2
    const [sermon] = await this.dataSource.query(
      `SELECT youtube_url, auto_publish FROM sermons WHERE id = $1`, [sermonId],
    );

    let audioUrl: string;

    if (sermon?.youtube_url) {
      // Download audio only from YouTube (fast, ~5-10MB for a 1hr sermon)
      // then upload to R2 and use signed URL for AssemblyAI
      audioUrl = await this.extractAndUploadAudio(sermonId, sermon.youtube_url);
      this.logger.log(`Audio extracted from YouTube and uploaded to R2`);
    } else {
      // Fall back to R2 signed URL
      const project = await this.videoProjectRepo.findBySermonId(sermonId);
      if (!project?.rawR2Key || project.rawDeleted) {
        throw new Error('No audio source available. Upload a video or add a YouTube URL first.');
      }
      audioUrl = await this.r2.getSignedUrl(project.rawR2Key, 7200);
      this.logger.log(`Using R2 signed URL for transcription`);
    }

    // Run transcription via AssemblyAI
    const result = await this.transcriptionService.transcribe(audioUrl);

    // Store transcript in sermon_metadata
    await this.dataSource.query(
      `INSERT INTO sermon_metadata (id, sermon_id, transcript_text, transcript_timestamps, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, NOW(), NOW())
       ON CONFLICT (sermon_id) DO UPDATE SET
         transcript_text = $2,
         transcript_timestamps = $3,
         updated_at = NOW()`,
      [sermonId, result.text, JSON.stringify(result.utterances)],
    );

    // Update sermon duration and status
    await this.dataSource.query(
      `UPDATE sermons SET status = 'transcribed', duration = COALESCE(duration, $2), updated_at = NOW() WHERE id = $1`,
      [sermonId, result.durationMs > 0 ? Math.round(result.durationMs / 1000) : null],
    );

    // Auto-publish if enabled
    if (sermon?.auto_publish) {
      await this.dataSource.query(
        `UPDATE sermons SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [sermonId],
      );
      this.logger.log(`Sermon ${sermonId} auto-published after transcription`);
    }

    // Queue AI processing (non-blocking — skip if Redis is down)
    try {
      await this.queue.enqueueSermonProcessing({ sermonId, step: 'embed' });
      await this.queue.enqueueSermonProcessing({ sermonId, step: 'auto-tag' });
    } catch {
      this.logger.warn(`Could not queue AI processing for sermon ${sermonId} — Redis may be down`);
    }

    this.logger.log(`Transcription complete: ${result.text.length} chars, ${result.utterances.length} utterances`);

    return result;
  }

  /**
   * Download audio-only from YouTube (much faster/smaller than full video),
   * upload to R2, return a signed URL for AssemblyAI
   */
  private async extractAndUploadAudio(sermonId: string, youtubeUrl: string): Promise<string> {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    const execAsync = promisify(exec);

    const tmpDir = path.join(os.tmpdir(), `ehcc-audio-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    const outputPath = path.join(tmpDir, 'audio.m4a');

    try {
      const ytdlp = process.env.YTDLP_PATH || '/Users/esl/Library/Python/3.14/bin/yt-dlp';
      const cmd = `${ytdlp} --js-runtimes nodejs -f "ba" -o "${outputPath}" "${youtubeUrl}"`;
      this.logger.log(`Downloading audio from YouTube...`);
      await execAsync(cmd, { timeout: 300000 });

      if (!fs.existsSync(outputPath)) {
        throw new Error('Audio download failed');
      }

      const fileSize = fs.statSync(outputPath).size;
      this.logger.log(`Audio downloaded: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);

      // Upload to R2
      const r2Key = `audio/${sermonId}/audio.m4a`;
      const buffer = fs.readFileSync(outputPath);
      await this.r2.uploadFile(r2Key, buffer, 'audio/mp4');

      // Return signed URL
      return await this.r2.getSignedUrl(r2Key, 7200);
    } finally {
      const fs2 = await import('fs');
      if (fs2.existsSync(tmpDir)) {
        fs2.rmSync(tmpDir, { recursive: true, force: true });
      }
    }
  }
}
