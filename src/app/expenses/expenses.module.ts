import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Module({
  providers: [ExpensesService],
})
export class ExpensesModule {}
