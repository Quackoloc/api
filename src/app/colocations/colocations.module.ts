import { Module } from '@nestjs/common';
import { ColocationsController } from './presentation/controllers/colocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colocation } from './domain/entities/colocation.entity';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { ColocationRepositoryToken } from './domain/gateways/colocation.repository.gateway';
import { DataSource } from 'typeorm';
import { ColocationRepository } from './infrastructure/repositories/colocation.repository';
import { CreateColocationUseCase } from './application/use-cases/create-colocation.use-case';
import { GetColocationsUseCase } from './application/use-cases/get-colocations.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Colocation]), UserModule, MailerModule],
  providers: [
    CreateColocationUseCase,
    GetColocationsUseCase,
    {
      provide: ColocationRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(Colocation);
        return new ColocationRepository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner);
      },
    },
  ],
  controllers: [ColocationsController],
})
export class ColocationsModule {}
