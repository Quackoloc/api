import { Module } from '@nestjs/common';
import { ColocationService } from './colocation.service';
import { ColocationController } from './colocation.controller';

@Module({
  providers: [ColocationService],
  controllers: [ColocationController],
})
export class ColocationModule {}
