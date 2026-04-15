import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class R2Client implements OnModuleInit {
  private readonly logger = new Logger(R2Client.name);
  private s3: S3Client;
  private bucketName: string;
  private cdnHostname: string;

  onModuleInit() {
    const accountId = process.env.R2_ACCOUNT_ID;
    this.bucketName = process.env.R2_BUCKET_NAME || '';
    this.cdnHostname = process.env.R2_CDN_HOSTNAME || '';

    if (!accountId) {
      this.logger.warn('R2_ACCOUNT_ID not set — R2 client disabled. Video upload/streaming will not work.');
      return;
    }

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });

    this.logger.log(`R2 client initialized for bucket: ${this.bucketName}`);
  }

  /**
   * Upload a file buffer to R2
   */
  async uploadFile(key: string, body: Buffer | Readable, contentType: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    this.logger.log(`Uploaded: ${key}`);
    return key;
  }

  /**
   * Generate a signed URL for private content (paid sermons)
   * Default expiry: 4 hours (14400 seconds) per the doc spec
   */
  async getSignedUrl(key: string, expiresIn: number = 14400): Promise<string> {
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
      { expiresIn },
    );
    return url;
  }

  /**
   * Get a public CDN URL (for free content)
   */
  getCdnUrl(key: string): string {
    return `https://${this.cdnHostname}/${key}`;
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
    this.logger.log(`Deleted: ${key}`);
  }

  /**
   * List files under a prefix
   */
  async listFiles(prefix: string): Promise<string[]> {
    const result = await this.s3.send(
      new ListObjectsV2Command({ Bucket: this.bucketName, Prefix: prefix }),
    );
    return (result.Contents || []).map((obj) => obj.Key!).filter(Boolean);
  }

  /**
   * Check if a file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucketName, Key: key }),
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(key: string): Promise<number> {
    const result = await this.s3.send(
      new HeadObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
    return result.ContentLength || 0;
  }

  /**
   * Calculate total storage used under a prefix (in bytes)
   */
  async getStorageUsed(prefix?: string): Promise<number> {
    let totalSize = 0;
    let continuationToken: string | undefined;

    do {
      const result = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of result.Contents || []) {
        totalSize += obj.Size || 0;
      }
      continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    return totalSize;
  }
}
