import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({
    status: 200,
    description: 'Successfully subscribed to newsletter',
  })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  async subscribe(@Body() body: { email: string; categories?: string[] }) {
    return await this.newsletterService.subscribe(body.email, body.categories);
  }

  @Delete('unsubscribe/:email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({
    status: 204,
    description: 'Successfully unsubscribed from newsletter',
  })
  async unsubscribe(@Param('email') email: string) {
    await this.newsletterService.unsubscribe(email);
  }

  @Patch(':email/categories')
  @ApiOperation({ summary: 'Update newsletter categories' })
  @ApiResponse({ status: 200, description: 'Successfully updated categories' })
  async updateCategories(
    @Param('email') email: string,
    @Body() body: { categories: string[] },
  ) {
    return await this.newsletterService.updateCategories(
      email,
      body.categories,
    );
  }
}