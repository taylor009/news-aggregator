import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'news-aggregator.sqlite',
  entities: [Article, User],
  synchronize: true, // Set to false in production
  logging: true,
};
