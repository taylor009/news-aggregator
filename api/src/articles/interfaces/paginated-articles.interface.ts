import { Article } from '../../entities/article.entity';

export interface PaginatedArticles {
  items: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
