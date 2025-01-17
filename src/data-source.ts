import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './modules/users/entities/user.entity';
import { Colocation } from './modules/colocations/entities/colocation.entity';
import { PendingUser } from './modules/users/entities/pending-user.entity';

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
  entities: [User, Colocation, PendingUser],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
