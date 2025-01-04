import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockArticlesRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticlesRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const articleData = {
        title: 'Test Article',
        content: 'Test Content',
        url: 'http://test.com',
        urlToImage: 'http://test.com/image.jpg',
        publishedAt: new Date(),
        source: 'Test Source',
      };

      const expectedArticle = { id: 1, ...articleData };

      mockArticlesRepository.create.mockReturnValue(expectedArticle);
      mockArticlesRepository.save.mockResolvedValue(expectedArticle);

      const result = await service.create(articleData);

      expect(result).toEqual(expectedArticle);
      expect(mockArticlesRepository.create).toHaveBeenCalledWith(articleData);
      expect(mockArticlesRepository.save).toHaveBeenCalledWith(expectedArticle);
    });

    it('should handle errors when creating article', async () => {
      mockArticlesRepository.save.mockRejectedValue(
        new Error('Database Error'),
      );
      const articleData = { title: 'Test' };

      await expect(service.create(articleData)).rejects.toThrow(
        'Database Error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const expectedArticles = [
        { id: 1, title: 'Article 1' },
        { id: 2, title: 'Article 2' },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(expectedArticles);

      const result = await service.findAll({});

      expect(result).toEqual(expectedArticles);
      expect(mockArticlesRepository.createQueryBuilder).toHaveBeenCalledWith(
        'article',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'article.publishedAt',
        'DESC',
      );
    });

    it('should handle pagination', async () => {
      const page = 1;
      const limit = 10;
      const expectedArticles = [{ id: 1, title: 'Article 1' }];

      mockQueryBuilder.getMany.mockResolvedValue(expectedArticles);

      await service.findAll({ page, limit });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(limit);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const expectedArticle = { id: 1, title: 'Test Article' };
      mockArticlesRepository.findOne.mockResolvedValue(expectedArticle);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedArticle);
      expect(mockArticlesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if article not found', async () => {
      mockArticlesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });
});
