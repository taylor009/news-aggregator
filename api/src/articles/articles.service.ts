import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async onModuleInit() {
    const count = await this.articleRepository.count();
    if (count === 0) {
      await this.seedTestData();
    }
  }

  private async seedTestData() {
    const articles = [
      {
        title: 'The Future of AI in Healthcare',
        content: `Artificial Intelligence is revolutionizing healthcare in ways we never imagined possible. From early disease detection to personalized treatment plans, AI is transforming how medical professionals diagnose and treat patients. Machine learning algorithms are now capable of analyzing medical images with unprecedented accuracy, often outperforming human experts in detecting conditions like cancer and heart disease.

        Recent studies have shown that AI-powered diagnostic tools can reduce error rates by up to 85% in certain specialties. Hospitals implementing these systems have reported significant improvements in patient outcomes and reduced waiting times. The technology is particularly promising in radiology and pathology, where AI can process vast amounts of visual data quickly and accurately.

        However, the integration of AI in healthcare also raises important ethical questions about patient privacy, data security, and the role of human judgment in medical decisions. Healthcare providers must carefully balance the benefits of AI automation with the need for human oversight and ethical considerations.

        Looking ahead, researchers are developing even more sophisticated AI applications, including predictive analytics for disease outbreaks and personalized medicine based on genetic profiles. The next decade could see AI becoming an indispensable tool in every aspect of healthcare delivery.`,
        url: 'https://example.com/ai-healthcare',
        imageUrl: 'https://source.unsplash.com/random/800x600?healthcare',
        source: 'Tech Health Journal',
        author: 'Dr. Sarah Johnson',
        categoriesJson: JSON.stringify(['technology', 'health']),
      },
      {
        title: 'Sustainable Energy Breakthroughs',
        content: `New developments in renewable energy technology are paving the way for a sustainable future. Scientists and engineers worldwide are making remarkable progress in improving the efficiency and reducing the cost of clean energy solutions. Solar panels are becoming more efficient than ever, with recent breakthroughs pushing conversion rates above 40%, while wind turbines are growing larger and more powerful, capable of powering thousands of homes with a single installation.

        One of the most exciting developments is in energy storage technology. Advanced battery systems are becoming more affordable and efficient, solving one of renewable energy's biggest challenges: intermittency. New solid-state batteries promise to revolutionize both grid storage and electric vehicles, offering faster charging times and longer lifespans than traditional lithium-ion batteries.

        Hydrogen fuel cells are also seeing significant advancement, particularly in industrial and transportation applications. Major automotive manufacturers are investing heavily in hydrogen technology, seeing it as a crucial component of a zero-emission future, especially for heavy vehicles and long-distance transport.

        The impact of these breakthroughs extends beyond environmental benefits. The renewable energy sector is creating millions of new jobs worldwide and helping to establish energy independence for many nations. Economic analysts predict that renewable energy will become the dominant power source within the next two decades, driven by both technological improvements and increasing environmental regulations.

        As these technologies continue to evolve, we're seeing innovative applications in urban planning and architecture. Buildings are being designed to integrate solar panels seamlessly into their structures, while offshore wind farms are becoming more efficient and less disruptive to marine ecosystems.`,
        url: 'https://example.com/sustainable-energy',
        imageUrl: 'https://source.unsplash.com/random/800x600?energy',
        source: 'Green Science Weekly',
        author: 'Michael Chen',
        categoriesJson: JSON.stringify(['science', 'environment']),
      },
      {
        title: 'The Rise of Quantum Computing',
        content: `Quantum computing is entering a new era of practical applications, moving beyond theoretical research into real-world implementations. Tech giants and startups alike are racing to develop quantum processors that can solve complex problems exponentially faster than classical computers. This breakthrough technology promises to revolutionize fields ranging from cryptography to drug discovery.

        The fundamental principle of quantum computing lies in quantum bits, or qubits, which can exist in multiple states simultaneously thanks to the principles of quantum mechanics. This property allows quantum computers to perform certain calculations in minutes that would take traditional supercomputers thousands of years to complete.

        Recent breakthroughs in error correction and qubit stability have brought us closer to achieving quantum supremacy in practical applications. Scientists have successfully demonstrated quantum algorithms that could revolutionize materials science, financial modeling, and climate prediction.

        However, significant challenges remain in scaling quantum systems and maintaining qubit coherence. Researchers are exploring various approaches, including superconducting circuits, trapped ions, and topological qubits, each with its own advantages and technical hurdles.

        The implications of successful quantum computing are profound. From breaking current encryption methods to optimizing supply chains and discovering new materials, quantum computers could transform nearly every industry. Companies and governments worldwide are investing billions in quantum research, recognizing its potential to create new industries and solve previously intractable problems.`,
        url: 'https://example.com/quantum-computing',
        imageUrl: 'https://source.unsplash.com/random/800x600?computer',
        source: 'Quantum Tech Review',
        author: 'Dr. Emily Zhang',
        categoriesJson: JSON.stringify(['technology', 'science']),
      },
    ];

    await Promise.all(
      articles.map((article) => this.articleRepository.save(article)),
    );
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    categories?: string[];
    search?: string;
  }) {
    const { page = 1, limit = 10, categories, search } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (categories?.length) {
      // Convert categories to lowercase for case-insensitive comparison
      const normalizedCategories = categories.map((cat) => cat.toLowerCase());
      queryBuilder.where(
        `EXISTS (
          SELECT 1 FROM json_each(article.categoriesJson) 
          WHERE LOWER(json_each.value) IN (:...categories)
        )`,
        { categories: normalizedCategories },
      );
    }

    if (search) {
      queryBuilder.andWhere(
        `(article.title LIKE :search OR article.content LIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const [articles, total] = await queryBuilder
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.articleRepository.findOneOrFail({ where: { id } });
  }

  async create(article: Partial<Article>) {
    // Ensure categories is always an array and normalize case
    if (article.categories) {
      const cats = article.categories as string | string[];
      article.categories = Array.isArray(cats)
        ? cats.map((cat) => cat.toLowerCase())
        : [cats.toLowerCase()];
    } else {
      article.categories = [];
    }

    const newArticle = this.articleRepository.create(article);
    return await this.articleRepository.save(newArticle);
  }

  async createMany(articles: Partial<Article>[]) {
    const processedArticles = articles.map((article) => ({
      ...article,
      categoriesJson: JSON.stringify(
        article.categories
          ? Array.isArray(article.categories)
            ? (article.categories as string[]).map((cat) => cat.toLowerCase())
            : [(article.categories as string).toLowerCase()]
          : [],
      ),
    }));

    const createdArticles = this.articleRepository.create(processedArticles);
    return await this.articleRepository.save(createdArticles);
  }
}
