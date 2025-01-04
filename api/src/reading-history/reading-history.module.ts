import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingHistory } from './reading-history.entity';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistoryController } from './reading-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingHistory])],
  providers: [ReadingHistoryService],
  controllers: [ReadingHistoryController],
  exports: [ReadingHistoryService],
})
export class ReadingHistoryModule {}
