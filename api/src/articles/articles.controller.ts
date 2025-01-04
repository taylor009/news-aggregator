import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categories') categories?: string[],
    @Query('search') search?: string,
  ) {
    return this.articlesService.findAll({
      page,
      limit,
      categories,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }
}
