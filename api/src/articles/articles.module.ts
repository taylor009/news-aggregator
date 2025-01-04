import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesGateway } from './articles.gateway';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), forwardRef(() => NewsModule)],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesGateway],
  exports: [ArticlesService],
})
export class ArticlesModule {}
