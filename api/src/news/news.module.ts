import { Module, forwardRef } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsScheduler } from './news.scheduler';
import { ArticlesModule } from '../articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    forwardRef(() => ArticlesModule),
    ConfigModule,
    ScheduleModule.forRoot(),
  ],
  providers: [NewsService, NewsScheduler],
  exports: [NewsService],
})
export class NewsModule {}
