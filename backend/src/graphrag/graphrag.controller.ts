import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GraphRAGService } from './graphrag.service';

@Controller('graphrag')
export class GraphRAGController {
  constructor(private readonly graphrag: GraphRAGService) {}

  @Post('query')
  async query(@Body('query') query: string) {
    return this.graphrag.query(query);
  }

  @Get('graph')
  async graphSearch(@Query('q') q: string, @Query('limit') limit = 10) {
    return this.graphrag.graphSearch(q, limit);
  }

  @Get('semantic')
  async semanticSearch(@Query('q') q: string, @Query('limit') limit = 5) {
    return this.graphrag.semanticSearch(q, limit);
  }

  @Post('reason')
  async aiReason(@Body('query') query: string, @Body('context') context: string) {
    return this.graphrag.aiReason(query, context);
  }

  @Get('stats')
  async stats() {
    return this.graphrag.graphStats();
  }
}