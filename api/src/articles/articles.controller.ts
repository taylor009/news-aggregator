import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from '../entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('categories') categories?: string[],
  ) {
    return this.articlesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      sortBy,
      sortOrder,
      search,
      categories,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Post()
  create(@Body() article: Partial<Article>) {
    return this.articlesService.create(article);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() article: Partial<Article>,
  ) {
    return this.articlesService.update(id, article);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
