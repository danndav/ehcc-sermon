import { Global, Module } from '@nestjs/common';
import { R2Client } from './r2.client';

@Global()
@Module({
  providers: [R2Client],
  exports: [R2Client],
})
export class R2Module {}
