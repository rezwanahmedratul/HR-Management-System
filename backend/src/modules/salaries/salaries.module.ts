import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from '../../entities/salary.entity';
import { SalariesService } from './salaries.service';
import { SalariesController } from './salaries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Salary])],
  providers: [SalariesService],
  controllers: [SalariesController],
  exports: [SalariesService],
})
export class SalariesModule {}
