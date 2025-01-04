import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { NewsModule } from './news/news.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { Article } from './entities/article.entity';
import { ArticleAnalytics } from './entities/article-analytics.entity';
import { NewsletterSubscriber } from './newsletter/newsletter-subscriber.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'news.db',
      entities: [Article, ArticleAnalytics, NewsletterSubscriber],
      synchronize: true,
      logging: true,
      extra: {
        enableJsonExtension: true,
      },
      entitySkipConstructor: true,
    }),
    ArticlesModule,
    NewsModule,
    NewsletterModule,
  ],
})
export class AppModule {}
