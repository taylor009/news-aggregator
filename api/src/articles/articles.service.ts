import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(options: {
    page?: number;
    limit?: number;
    categories?: string[];
    search?: string;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (options.categories?.length) {
      queryBuilder.where('article.category IN (:...categories)', {
        categories: options.categories,
      });
    }

    if (options.search) {
      const searchCondition = options.categories?.length ? 'andWhere' : 'where';
      queryBuilder[searchCondition](
        '(article.title LIKE :search OR article.content LIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    return queryBuilder
      .orderBy('article.publishedAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  }

  async findOne(id: number) {
    return this.articleRepository.findOne({ where: { id } });
  }

  async findByUrl(url: string) {
    return this.articleRepository.findOne({ where: { url } });
  }

  async create(article: Partial<Article>) {
    const newArticle = this.articleRepository.create(article);
    return this.articleRepository.save(newArticle);
  }

  async update(id: number, article: Partial<Article>) {
    await this.articleRepository.update(id, article);
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.articleRepository.delete(id);
  }
}
