import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly articlesService: ArticlesService,
  ) {}

  async syncNews() {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');
    const apiUrl = 'https://newsapi.org/v2/top-headlines';

    const { data } = await firstValueFrom(
      this.httpService.get(apiUrl, {
        params: {
          apiKey,
          country: 'us',
        },
      }),
    );

    if (data.status === 'error') {
      throw new Error(data.message || 'Failed to fetch news');
    }

    const articles = data.articles.map((article: any) => ({
      title: article.title,
      content: article.content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: new Date(article.publishedAt),
      source: article.source.name,
    }));

    for (const article of articles) {
      await this.articlesService.create(article);
    }
  }

  async getNews() {
    return this.articlesService.findAll({
      page: 1,
      limit: 100,
    });
  }
}
