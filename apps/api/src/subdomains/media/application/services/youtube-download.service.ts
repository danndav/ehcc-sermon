import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { R2Client } from '../../../../aop/r2/r2.client';
import { VideoProjectRepository } from '../../infrastructure/repositories/video-project.repository';
import { VideoProject, VideoStatusEnum } from '../../domain/entities/video-project.entity';
import { QueueService } from '../../../../aop/queue/services/queue.service';

const execAsync = promisify(exec);

// Title prefixes that indicate a pastor/speaker name
const PASTOR_PREFIXES = /\b(rev\.?|reverend|dr\.?|pastor|minister|apostle|prophet|evangelist|bishop|deaconess|elder)\b/i;

// Programme type keywords
const PROGRAMME_MAP: Record<string, string> = {
  'morning by morning': 'morning_by_morning',
  'mbm': 'morning_by_morning',
  'sunday service': 'sunday_service',
  'midweek service': 'midweek_service',
  'midweek': 'midweek_service',
  '3 days of glory': '3dg',
  '3dg': '3dg',
  'three days of glory': '3dg',
  'throne of david': 'tod',
  'tod': 'tod',
};

export interface YoutubeVideoInfo {
  title: string;
  sermonTitle: string;
  pastorName: string | null;
  programmeType: string;
  scriptureReference: string | null;
  duration: number;
  thumbnailUrl: string;
  uploadDate: string | null;
  description: string;
  youtubeUrl: string;
}

@Injectable()
export class YoutubeDownloadService {
  private readonly logger = new Logger(YoutubeDownloadService.name);

  constructor(
    private readonly r2: R2Client,
    private readonly videoProjectRepo: VideoProjectRepository,
    private readonly queue: QueueService,
  ) {}

  /**
   * Extract metadata from YouTube URL and auto-detect sermon details
   */
  async getVideoInfo(youtubeUrl: string): Promise<YoutubeVideoInfo> {
    const ytdlp = process.env.YTDLP_PATH || '/Users/esl/Library/Python/3.14/bin/yt-dlp';
    const cmd = `${ytdlp} --js-runtimes nodejs --dump-json --no-download "${youtubeUrl}"`;
    const { stdout } = await execAsync(cmd, { timeout: 30000 });
    const data = JSON.parse(stdout);

    const rawTitle: string = data.title || '';
    const duration: number = data.duration || 0;
    const thumbnailUrl: string = data.thumbnail || '';
    const uploadDate: string = data.upload_date || '';
    const description: string = (data.description || '').substring(0, 1000);

    // Parse title — handles multiple separators:
    // "TITLE | SCRIPTURE | PROGRAMME | PASTOR"
    // "TITLE - PASTOR - PROGRAMME"
    // "TITLE — PASTOR (PROGRAMME)"
    const separator = rawTitle.includes('|') ? '|' : rawTitle.includes('—') ? '—' : rawTitle.includes(' - ') ? ' - ' : '|';
    const parts = rawTitle.split(separator).map((p: string) => p.trim()).filter(Boolean);

    let sermonTitle = rawTitle;
    let pastorName: string | null = null;
    let programmeType = 'sunday_service';
    let scriptureReference: string | null = null;

    for (const part of parts) {
      const lower = part.toLowerCase();

      // Check for programme type
      for (const [keyword, type] of Object.entries(PROGRAMME_MAP)) {
        if (lower.includes(keyword)) {
          programmeType = type;
          break;
        }
      }

      // Check for pastor name (detect by title prefix: Rev, Dr, Pastor, Minister, etc.)
      if (!pastorName && PASTOR_PREFIXES.test(part)) {
        // Title-case the name
        pastorName = part.trim().split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
          // Fix common abbreviations
          .replace(/\bRev\b/i, 'Rev')
          .replace(/\bDr\b/i, 'Dr')
          .replace(/\bMin\b/i, 'Min');
      }

      // Check for scripture reference (book + chapter:verse pattern)
      if (/\b(genesis|exodus|leviticus|numbers|deuteronomy|joshua|judges|ruth|samuel|kings|chronicles|ezra|nehemiah|esther|job|psalm|proverbs|ecclesiastes|song|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi|matthew|mark|luke|john|acts|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|revelation)\b/i.test(part)) {
        scriptureReference = part;
      }
    }

    // Sermon title is the first part that isn't programme, pastor, or scripture
    if (parts.length > 1) {
      sermonTitle = parts.find((p: string) => {
        const lower = p.toLowerCase();
        const isProgramme = Object.keys(PROGRAMME_MAP).some(k => lower.includes(k));
        const isPastor = PASTOR_PREFIXES.test(p);
        const isScripture = p === scriptureReference;
        return !isProgramme && !isPastor && !isScripture;
      }) || parts[0];
    }

    // Title case the sermon title
    sermonTitle = sermonTitle
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    // Format upload date
    const formattedDate = uploadDate
      ? `${uploadDate.slice(0, 4)}-${uploadDate.slice(4, 6)}-${uploadDate.slice(6, 8)}`
      : null;

    return {
      title: rawTitle,
      sermonTitle,
      pastorName,
      programmeType,
      scriptureReference,
      duration,
      thumbnailUrl,
      uploadDate: formattedDate,
      description,
      youtubeUrl,
    };
  }

  /**
   * Download a YouTube video, upload to R2, create video project, queue transcription
   */
  async downloadAndStore(sermonId: string, youtubeUrl: string): Promise<{ projectId: string; status: string }> {
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      throw new BadRequestException('Invalid YouTube URL');
    }

    const tmpDir = path.join(os.tmpdir(), `ehcc-yt-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    const outputPath = path.join(tmpDir, 'video.mp4');

    try {
      // Step 1: Download with yt-dlp
      this.logger.log(`Downloading YouTube video: ${youtubeUrl}`);
      const ytdlp = process.env.YTDLP_PATH || '/Users/esl/Library/Python/3.14/bin/yt-dlp';
      const cmd = `${ytdlp} --js-runtimes nodejs -f "bv*+ba/b" --merge-output-format mp4 -o "${outputPath}" "${youtubeUrl}"`;

      await execAsync(cmd, { timeout: 600000 }); // 10 min timeout

      if (!fs.existsSync(outputPath)) {
        throw new Error('yt-dlp download failed — output file not found');
      }

      const fileSize = fs.statSync(outputPath).size;
      this.logger.log(`Downloaded: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);

      // Step 2: Upload to R2
      const r2Key = `raw/${sermonId}/original.mp4`;
      const fileBuffer = fs.readFileSync(outputPath);
      await this.r2.uploadFile(r2Key, fileBuffer, 'video/mp4');
      this.logger.log(`Uploaded to R2: ${r2Key}`);

      // Step 3: Create video project record
      const existing = await this.videoProjectRepo.findBySermonId(sermonId);
      const project: Partial<VideoProject> = existing || {};
      project.sermonId = sermonId;
      project.rawR2Key = r2Key;
      project.hlsPrefix = `processed/${sermonId}`;
      project.status = VideoStatusEnum.UPLOADED;
      project.fileSizeBytes = fileSize;
      project.rawDeleted = false;
      project.errorMessage = null;

      const saved = await this.videoProjectRepo.save(project);

      // Step 4: Queue transcription
      await this.queue.enqueueSermonProcessing({ sermonId, step: 'transcribe' });

      this.logger.log(`YouTube video processed for sermon ${sermonId}: project ${saved.id}`);
      return { projectId: saved.id, status: 'uploaded' };

    } finally {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    }
  }
}
