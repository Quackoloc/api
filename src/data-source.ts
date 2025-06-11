import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Apply migration on local
dotenv.config();

// Apply migration on production database
// dotenv.config({ path: '.env.prod' });

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/app/**/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
