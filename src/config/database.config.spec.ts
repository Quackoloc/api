import { describe } from 'node:test';
import { ConfigService } from '@nestjs/config';
import { localConf } from './database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

describe('local-database-config', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it('should return the correct TypeOrmModuleOptions', () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      const config = {
        POSTGRES_HOST: 'localhost',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpassword',
        POSTGRES_DB: 'testdb',
      };
      return config[key];
    });

    const options: TypeOrmModuleOptions = {
      ...localConf(configService),
      synchronize: false,
      entities: [],
    };

    expect(options).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testuser',
      password: 'testpassword',
      database: 'testdb',
      synchronize: false,
      entities: [],
    });
  });
});
