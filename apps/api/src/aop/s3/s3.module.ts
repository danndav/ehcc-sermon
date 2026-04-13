import { Module } from '@nestjs/common';

import { S3Client } from './s3.client';

@Module({
  exports: [S3Client],
  providers: [S3Client],
})
export class S3Module {}
