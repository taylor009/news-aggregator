import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { NewsService } from '../news/news.service';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
  ) {}

  async onModuleInit() {
    const count = await this.articleRepository.count();
    if (count === 0) {
      console.log('No articles found in database. Fetching from NewsAPI...');
      // Fetch general articles
      await this.newsService.fetchAndStoreArticles();

      // Fetch articles for each category to ensure we have diverse content
      const categories = [
        'technology',
        'business',
        'science',
        'health',
        'entertainment',
      ];
      for (const category of categories) {
        await this.newsService.fetchArticlesByCategory(category);
        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    categories?: string[],
  ) {
    try {
      const skip = (page - 1) * limit;
      const query = this.articleRepository.createQueryBuilder('article');

      // Add search condition if search parameter is provided
      if (search) {
        query.where(
          '(article.title LIKE :search OR article.content LIKE :search)',
          {
            search: `%${search}%`,
          },
        );
      }

      // Add categories condition if categories are provided
      if (categories && categories.length > 0) {
        const categoryConditions = categories.map((category, index) => {
          const param = `category${index}`;
          return `article.categories LIKE :${param}`;
        });

        const whereClause = categoryConditions.join(' OR ');
        const params = categories.reduce((acc, category, index) => {
          acc[`category${index}`] = `%${category}%`;
          return acc;
        }, {});

        if (search) {
          query.andWhere(`(${whereClause})`, params);
        } else {
          query.where(`(${whereClause})`, params);
        }
      }

      // Get total count
      const total = await query.getCount();

      // Get paginated results
      const articles = await query
        .orderBy(`article.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    return this.articleRepository.findOneOrFail({ where: { id } });
  }

  async create(article: Partial<Article>) {
    // Ensure categories is always an array
    if (article.categories) {
      article.categories = Array.isArray(article.categories)
        ? article.categories
        : [article.categories];
    } else {
      article.categories = [];
    }

    const newArticle = this.articleRepository.create(article);
    return await this.articleRepository.save(newArticle);
  }

  async update(id: number, article: Partial<Article>) {
    // Ensure categories is always an array when updating
    if (article.categories) {
      article.categories = Array.isArray(article.categories)
        ? article.categories
        : [article.categories];
    }

    await this.articleRepository.update(id, article);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.articleRepository.delete(id);
  }
}
