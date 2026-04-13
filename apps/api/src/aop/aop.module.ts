import { Module } from '@nestjs/common';

import { AuthenticationModule } from './authentication/authentication.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule, AuthenticationModule],
})
export class AopModule {}
