import { Module } from '@nestjs/common';
import { GraphRAGController } from './graphrag.controller';
import { GraphRAGService } from './graphrag.service';

@Module({
  controllers: [GraphRAGController],
  providers: [GraphRAGService],
  exports: [GraphRAGService],
})
export class GraphRAGModule {}