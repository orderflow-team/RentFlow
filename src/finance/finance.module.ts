import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { ResponsibilitiesController } from './responsibilities.controller';
import { ResponsibilitiesService } from './responsibilities.service';

@Module({
  controllers: [FinanceController, ResponsibilitiesController],
  providers: [FinanceService, ResponsibilitiesService],
  exports: [FinanceService, ResponsibilitiesService],
})
export class FinanceModule {}
