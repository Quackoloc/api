import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './modules/users/entities/user.entity';
import { Colocation } from './modules/colocations/entities/colocation.entity';
import { UserColocation } from './modules/colocations/entities/user-colocation.entity';

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
  entities: [User, Colocation, UserColocation],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
});
