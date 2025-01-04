import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface SubscriptionDto {
  email: string;
  preferredTopics: string[];
  frequency: string;
  preferredTime?: string;
  receiveBreakingNews: boolean;
}

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
  async subscribe(@Body() subscriptionData: SubscriptionDto) {
    return this.newsletterService.subscribe(subscriptionData);
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
}
