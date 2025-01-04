import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly articlesService: ArticlesService,
  ) {}

  async syncNews() {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');
    if (!apiKey) {
      throw new Error('NEWS_API_KEY is not configured');
    }

    const apiUrl = 'https://newsapi.org/v2/top-headlines';

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(apiUrl, {
          params: {
            apiKey,
            country: 'us',
            pageSize: 20,
          },
        }),
      );

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error('Invalid response format');
      }

      for (const article of data.articles) {
        try {
          const articleData = {
            title: article.title || 'Untitled',
            content: article.content,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : new Date(),
            source: article.source?.name || 'Unknown Source',
            categoriesJson: [],
          };

          if (!articleData.url || !articleData.title) {
            this.logger.warn(
              `Skipping article due to missing required fields: ${articleData.title}`,
            );
            continue;
          }

          await this.articlesService.create(articleData);
          this.logger.debug(`Created article: ${articleData.title}`);
        } catch (error) {
          this.logger.error(
            `Failed to create article: ${article.title}`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Successfully created ${data.articles.length} new articles`,
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        this.logger.warn('News API rate limit reached');
        throw error;
      }
      this.logger.error('Failed to sync news:', error.message);
      throw error;
    }
  }

  async getNews() {
    return this.articlesService.findAll({
      page: 1,
      limit: 100,
    });
  }
}
