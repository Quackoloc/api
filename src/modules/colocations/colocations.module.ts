import { Module } from '@nestjs/common';
import { ColocationsService } from './colocations.service';
import { ColocationsController } from './colocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colocation } from './entities/colocation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Colocation]), UsersModule],
  providers: [ColocationsService],
  controllers: [ColocationsController],
})
export class ColocationsModule {}
