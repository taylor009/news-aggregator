import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { ConfigModule } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../articles/entities/article.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('NewsService', () => {
  let service: NewsService;
  let articlesService: ArticlesService;
  let httpService: HttpService;

  const mockArticlesRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockArticlesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        NewsService,
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticlesRepository,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    articlesService = module.get<ArticlesService>(ArticlesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncNews', () => {
    it('should fetch and save articles', async () => {
      const mockNewsData = {
        articles: [
          {
            title: 'Test Article',
            content: 'Test Content',
            url: 'http://test.com',
            urlToImage: 'http://test.com/image.jpg',
            publishedAt: new Date().toISOString(),
            source: { name: 'Test Source' },
          },
        ],
      };

      mockHttpService.get.mockReturnValue(
        of({ data: mockNewsData, status: 200 }),
      );
      mockArticlesService.create.mockResolvedValue(mockNewsData.articles[0]);

      await service.syncNews();

      expect(mockArticlesService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockNewsData.articles[0].title,
          source: mockNewsData.articles[0].source.name,
        }),
      );
    });

    it('should handle API errors', async () => {
      mockHttpService.get.mockReturnValue(
        of({ data: { status: 'error' }, status: 400 }),
      );

      await expect(service.syncNews()).rejects.toThrow();
    });
  });

  describe('getNews', () => {
    it('should return latest news articles', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Test Article',
          content: 'Test Content',
        },
      ];

      mockArticlesService.findAll.mockResolvedValue(mockArticles);

      const result = await service.getNews();

      expect(result).toEqual(mockArticles);
      expect(mockArticlesService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
      });
    });

    it('should handle errors when getting news', async () => {
      mockArticlesService.findAll.mockRejectedValue(
        new Error('Database Error'),
      );

      await expect(service.getNews()).rejects.toThrow('Database Error');
    });
  });
});
