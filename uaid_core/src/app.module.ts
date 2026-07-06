import { Module } from '@nestjs/common';
import { GraphRAGModule } from './graphrag/graphrag.module';

@Module({
  imports: [GraphRAGModule],
})
export class AppModule {}