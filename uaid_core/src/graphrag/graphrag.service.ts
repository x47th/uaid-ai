import { Injectable, OnModuleInit } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';

@Injectable()
export class GraphRAGService implements OnModuleInit {
  private driver: neo4j.Driver;
  private qdrantUrl = 'http://localhost:6333';
  private deepseekKey: string;
  private deepseekUrl = 'https://api.deepseek.com/v1';

  async onModuleInit() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'UAID2026secure!'),
    );
    this.deepseekKey = process.env.DEEPSEEK_API_KEY || '';
  }

  // ── Graph Search ────────────────────────────────────
  async graphSearch(query: string, limit = 10) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n) WHERE n.name CONTAINS $query OR n.content CONTAINS $query
         RETURN n.name as name, labels(n) as type, n.content as content
         LIMIT $limit`,
        { query, limit: neo4j.int(limit) },
      );
      return result.records.map(r => ({
        name: r.get('name'),
        type: r.get('type')[0],
        content: (r.get('content') || '').slice(0, 300),
      }));
    } finally {
      await session.close();
    }
  }

  async graphStats() {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (n) RETURN labels(n) as labels, count(n) as cnt',
      );
      return result.records.map(r => ({ type: r.get('labels')[0], count: r.get('cnt').toNumber() }));
    } finally {
      await session.close();
    }
  }

  // ── Semantic Search (Qdrant) ────────────────────────
  async semanticSearch(query: string, limit = 5) {
    const vec = await this.embed(query);
    const res = await fetch(`${this.qdrantUrl}/collections/uaid_knowledge/points/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: vec, limit, with_payload: true }),
    });
    const data = await res.json();
    return (data.result?.points || []).map((p: any) => ({
      score: p.score,
      name: p.payload?.name,
      preview: p.payload?.preview?.slice(0, 200),
    }));
  }

  // ── AI Reasoning ─────────────────────────────────────
  async aiReason(query: string, context: string) {
    const res = await fetch(`${this.deepseekUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.deepseekKey}` },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: [
          { role: 'system', content: 'You are UAID AI assistant. Use the provided context to answer accurately.' },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` },
        ],
        max_tokens: 800,
      }),
    });
    const data = await res.json();
    return {
      answer: data.choices?.[0]?.message?.content || '',
      tokens: data.usage?.total_tokens || 0,
      model: data.model,
    };
  }

  // ── Full GraphRAG Pipeline ───────────────────────────
  async query(query: string) {
    const [graph, semantic] = await Promise.all([
      this.graphSearch(query, 5),
      this.semanticSearch(query, 3),
    ]);

    const context = [
      '## Graph Knowledge',
      ...graph.map(g => `- [${g.type}] ${g.name}: ${g.content}`),
      '## Semantic Matches',
      ...semantic.map(s => `- ${s.name}: ${s.preview}`),
    ].join('\n');

    const ai = await this.aiReason(query, context);

    return {
      query,
      graph_results: graph,
      semantic_results: semantic,
      ai_answer: ai.answer,
      tokens: ai.tokens,
      model: ai.model,
    };
  }

  // ── Embedding Helper ─────────────────────────────────
  private async embed(text: string): Promise<number[]> {
    // Hash-based fallback (384-dim)
    if (!this.deepseekKey) {
      const hash = require('crypto').createHash('sha256').update(text).digest();
      const vec: number[] = [];
      for (let i = 0; i < hash.length; i += 4) {
        vec.push(hash.readFloatBE(i));
      }
      const dim = 384;
      while (vec.length < dim) vec.push(...vec.slice(0, dim - vec.length));
      return vec.slice(0, dim);
    }

    try {
      const res = await fetch(`${this.deepseekUrl}/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.deepseekKey}` },
        body: JSON.stringify({ model: 'deepseek-v4-flash', input: text.slice(0, 8000) }),
      });
      const data = await res.json();
      const vec = data.data?.[0]?.embedding || [];
      const dim = 384;
      while (vec.length < dim) vec.push(0);
      return vec.slice(0, dim);
    } catch {
      return this.hashEmbed(text);
    }
  }

  private hashEmbed(text: string): number[] {
    const hash = require('crypto').createHash('sha256').update(text).digest();
    const vec: number[] = [];
    for (let i = 0; i < hash.length; i += 4) vec.push(hash.readFloatBE(i));
    const dim = 384;
    while (vec.length < dim) vec.push(...vec.slice(0, dim - vec.length));
    return vec.slice(0, dim);
  }
}