export interface Article {
  id: number;
  title: string;
  url: string;
  content: string;
  source: string;
  author?: string;
  imageUrl?: string;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  source?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginatedArticles {
  items: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
