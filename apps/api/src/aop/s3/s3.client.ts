import { PutObjectCommand, PutObjectCommandOutput, S3Client as AWSS3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export enum S3BucketNameSuffix {
  Assets = 'ehcc',
}

@Injectable()
export class S3Client {
  private readonly logger = new Logger(S3Client.name);
  private buckets: Map<S3BucketNameSuffix, [AWSS3Client, string]> = new Map();

  constructor() {
    const result = this.initS3();
    if (result) {
      this.buckets.set(S3BucketNameSuffix.Assets, result);
    }
  }

  private initS3(): [AWSS3Client, string] | null {
    const region = process.env.AWS_BUCKET_REGION;
    const bucketName = process.env.AWS_ASSETS_BUCKET_NAME;

    if (!region || !bucketName) {
      this.logger.warn('AWS_BUCKET_REGION / AWS_ASSETS_BUCKET_NAME not set — S3 client disabled');
      return null;
    }

    const s3 = new AWSS3Client({
      region,
      maxAttempts: 3,
    });

    return [s3, bucketName];
  }

  async getPresignedUploadUrl(
    key: string,
    bucketNameSuffix: S3BucketNameSuffix,
    expiresIn: number = 1800 // Default 30 minutes
  ): Promise<string> {
    this.logger.log(`Generating presigned URL for key: ${key}`);
    
    try {
      const [s3, bucketName] = this.buckets.get(bucketNameSuffix)!;
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const url = await getSignedUrl(s3, command, { expiresIn });
      this.logger.log(`Presigned URL generated successfully for key: ${key}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for key: ${key}`, error);
      throw new InternalServerErrorException(`Failed to generate presigned URL: ${(error as Error).message}`);
    }
  }

  async uploadToS3(
    attachment: { file: Buffer; contentType?: string },
    key: string,
    bucketNameSuffix: S3BucketNameSuffix
  ): Promise<string | undefined> {
    this.logger.log(`Starting S3 upload for key: ${key}`);
    
    try {
      if (this.isLocalEnvironment()) {
        await this.uploadWithCLI(attachment.file, key, bucketNameSuffix, attachment.contentType);
      } else {
        await this.uploadWithSDK(attachment.file, key, bucketNameSuffix, attachment.contentType);
      }
      
      this.logger.log(`Upload successful for key: ${key}`);
      return key;
    } catch (error) {
      this.logger.error(`Upload failed for key: ${key}`, error);
      throw new InternalServerErrorException(`Failed to upload file to S3: ${(error as Error).message}`);
    }
  }

  private isLocalEnvironment(): boolean {
    const isLocal = !process.env.AWS_EXECUTION_ENV && !process.env.NODE_ENV?.includes('production');
    this.logger.log(`Using ${isLocal ? 'CLI (Local)' : 'SDK (Dev/Prod)'} for S3 upload`);
    return isLocal;
  }

  private async uploadWithCLI(fileBuffer: Buffer, key: string, bucketNameSuffix: S3BucketNameSuffix, contentType?: string): Promise<void> {
    const [, bucketName] = this.buckets.get(bucketNameSuffix)!;
    const tempFile = path.join(os.tmpdir(), `upload-${Date.now()}.tmp`);

    try {
      fs.writeFileSync(tempFile, fileBuffer);
      
      const command = `aws s3 cp "${tempFile}" "s3://${bucketName}/${key}" ` +
        `--region us-east-1 ` +
        `--content-type "${contentType || 'image/png'}" ` +
        `--content-disposition "inline" ` +
        `--cache-control "public, max-age=31536000"`;
      
      this.logger.log(`CLI upload: ${fileBuffer.length} bytes to s3://${bucketName}/${key}`);
      
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      
      if (stderr && !stderr.includes('upload:')) {
        throw new Error(`CLI error: ${stderr}`);
      }
      
      this.logger.log('CLI upload successful');
      
    } finally {
      // Cleanup
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }

  private async uploadWithSDK(
    fileBuffer: Buffer, 
    key: string, 
    bucketNameSuffix: S3BucketNameSuffix, 
    contentType?: string
  ): Promise<void> {
    const [s3, bucketName] = this.buckets.get(bucketNameSuffix)!;

    this.logger.log(`SDK upload: ${fileBuffer.length} bytes to s3://${bucketName}/${key}`);

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType || 'application/octet-stream', 
        ContentDisposition: 'inline',
      });
      const result: PutObjectCommandOutput = await s3.send(command);
      this.logger.log(`SDK upload successful - ETag: ${result.ETag}`);
    } catch (error) {
      this.logger.error(`putObject failed:`, error);
      throw error;
    }
  }
}
