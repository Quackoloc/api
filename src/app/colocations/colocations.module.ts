import { Module } from '@nestjs/common';
import { ColocationsService } from './colocations.service';
import { ColocationsController } from './colocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colocation } from './entities/colocation.entity';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Colocation]), UsersModule, MailerModule],
  providers: [ColocationsService],
  controllers: [ColocationsController],
})
export class ColocationsModule {}
