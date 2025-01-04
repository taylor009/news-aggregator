import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';

interface TrackReadingDto {
  userId: string;
  articleId: number;
  progress: number;
}

@Controller('reading-history')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}

  @Post('track')
  async trackReading(@Body() data: TrackReadingDto) {
    return this.readingHistoryService.trackReading(data);
  }

  @Post(':userId/articles/:articleId/read-later')
  async toggleReadLater(
    @Param('userId') userId: string,
    @Param('articleId') articleId: number,
  ) {
    return this.readingHistoryService.toggleReadLater(userId, articleId);
  }

  @Get(':userId/history')
  async getReadingHistory(@Param('userId') userId: string) {
    return this.readingHistoryService.getReadingHistory(userId);
  }

  @Get(':userId/read-later')
  async getReadLaterList(@Param('userId') userId: string) {
    return this.readingHistoryService.getReadLaterList(userId);
  }

  @Get(':userId/articles/:articleId/progress')
  async getReadingProgress(
    @Param('userId') userId: string,
    @Param('articleId') articleId: number,
  ) {
    return this.readingHistoryService.getReadingProgress(userId, articleId);
  }

  @Get(':userId/recently-read')
  async getRecentlyRead(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.readingHistoryService.getRecentlyRead(userId, limit);
  }
}
