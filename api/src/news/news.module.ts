import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsScheduler } from './news.scheduler';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  providers: [NewsService, NewsScheduler],
  exports: [NewsService],
})
export class NewsModule {}
