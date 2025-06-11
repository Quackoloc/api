import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../app/user/domain/entities/user.entity';
import { Colocation } from '../app/colocations/domain/entities/colocation.entity';
import { PendingUser } from '../app/user/domain/entities/pending-user.entity';

export const localConf = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [User, Colocation, PendingUser],
  synchronize: false,
});
