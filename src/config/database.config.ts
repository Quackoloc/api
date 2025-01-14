import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Colocation } from '../modules/colocations/entities/colocation.entity';

export const localConf = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [User, Colocation],
  synchronize: true,
});
