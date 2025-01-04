import { IsString, IsUrl, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The URL of the original article' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'The main content of the article' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'The source of the article' })
  @IsString()
  source: string;

  @ApiPropertyOptional({ description: 'The author of the article' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ description: "The URL of the article's image" })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Categories the article belongs to' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}
