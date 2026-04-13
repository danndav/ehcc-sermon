import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource from '../../../ormconfig';
import { customerContextProvider } from './providers/customer-context.provider';

@Module({
  exports: [customerContextProvider],
  imports: [TypeOrmModule.forRoot({ ...dataSource.options, autoLoadEntities: true })],
  providers: [customerContextProvider],
})
export class DbModule {}
