import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  applicationName: 'EHCC Plus',
  entities: [__dirname + '/src/subdomains/**/domain/entities/*{.ts,.js}'],
  logger: process.env.E2E ? 'file' : 'simple-console',
  logging: process.env.TYPEORM_LOGGING === 'true',
  migrations: [__dirname + '/src/aop/db/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  type: 'postgres',
  url: process.env.TYPEORM_URL,
  ssl: process.env.NODE_ENV === 'local' ? false : {
    rejectUnauthorized: false
  }
});
