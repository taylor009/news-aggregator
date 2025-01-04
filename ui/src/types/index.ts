export interface Article {
  id: number;
  title: string;
  description?: string;
  content: string;
  url: string;
  urlToImage?: string;
  publishedAt: Date;
  source: string;
  category?: string;
}
