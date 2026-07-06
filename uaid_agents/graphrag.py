"""
UAID GraphRAG — Hybrid Retrieval-Augmented Generation
Connects Neo4j (structured knowledge) + Qdrant (semantic search) + DeepSeek (reasoning)
"""

import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import OpenAI

load_dotenv()

# ── Config ──────────────────────────────────────────────
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASS = os.getenv("NEO4J_PASSWORD", "UAID2026secure!")
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", "6333"))
COLLECTION = "uaid_knowledge"
EMBED_SIZE = 384  # all-MiniLM-L6-v2 outputs 384-dim vectors


class UaidGraphRAG:
    """Hybrid RAG engine: Neo4j graph + Qdrant vectors + DeepSeek LLM."""

    def __init__(self):
        self.neo4j = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
        self.qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        self.llm = OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com/v1",
        )
        self._init_qdrant()

    def _init_qdrant(self):
        """Ensure the vector collection exists."""
        cols = [c.name for c in self.qdrant.get_collections().collections]
        if COLLECTION not in cols:
            self.qdrant.create_collection(
                collection_name=COLLECTION,
                vectors_config=VectorParams(size=EMBED_SIZE, distance=Distance.COSINE),
            )

    # ── Neo4j: Structured Knowledge ──────────────────────

    def add_client(self, name: str, industry: str = "", notes: str = ""):
        """Add a client node to the knowledge graph."""
        with self.neo4j.session() as s:
            s.run(
                "MERGE (c:Client {name: $name}) "
                "SET c.industry = $industry, c.notes = $notes",
                name=name, industry=industry, notes=notes,
            )

    def add_solution(self, client_name: str, problem: str, solution: str):
        """Link a problem → solution to a client."""
        with self.neo4j.session() as s:
            s.run(
                "MERGE (c:Client {name: $client}) "
                "MERGE (p:Problem {name: $problem}) "
                "MERGE (s:Solution {name: $solution}) "
                "MERGE (c)-[:HAS_PROBLEM]->(p) "
                "MERGE (p)-[:SOLVED_BY]->(s)",
                client=client_name, problem=problem, solution=solution,
            )

    def graph_search(self, query: str, limit: int = 5) -> list:
        """Search the Neo4j knowledge graph."""
        with self.neo4j.session() as s:
            result = s.run(
                "MATCH (c:Client)-[:HAS_PROBLEM]->(p:Problem)-[:SOLVED_BY]->(s:Solution) "
                "WHERE toLower(c.name) CONTAINS toLower($q) "
                "   OR toLower(p.name) CONTAINS toLower($q) "
                "   OR toLower(s.name) CONTAINS toLower($q) "
                "RETURN c.name AS client, p.name AS problem, s.name AS solution "
                "LIMIT $limit",
                q=query, limit=limit,
            )
            return [dict(r) for r in result]

    # ── Qdrant: Semantic Search ──────────────────────────

    def embed(self, text: str) -> list[float]:
        """Embed text using sentence-transformers (all-MiniLM-L6-v2)."""
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            vec = model.encode(text[:2000]).tolist()
            if len(vec) < EMBED_SIZE:
                vec = vec + [0.0] * (EMBED_SIZE - len(vec))
            return vec[:EMBED_SIZE]
        except Exception:
            import hashlib, struct
            h = hashlib.sha256(text.encode()).digest()
            vec = list(struct.unpack("f" * (len(h) // 4), h))
            return (vec * (EMBED_SIZE // len(vec) + 1))[:EMBED_SIZE]

    def add_document(self, doc_id: str, text: str, metadata: dict = None):
        """Index a document in Qdrant."""
        vec = self.embed(text)
        self.qdrant.upsert(
            collection_name=COLLECTION,
            points=[
                PointStruct(
                    id=hash(doc_id) % (2**63),
                    vector=vec,
                    payload={"doc_id": doc_id, "text": text[:500], **(metadata or {})},
                )
            ],
        )

    def semantic_search(self, query: str, limit: int = 3) -> list:
        """Semantic search in Qdrant vector store."""
        vec = self.embed(query)
        results = self.qdrant.query_points(
            collection_name=COLLECTION, query=vec, limit=limit
        ).points
        return [{"id": r.id, "score": r.score, "text": r.payload.get("text", "")} for r in results]

    # ── GraphRAG: Combined Query ─────────────────────────

    def query(self, user_query: str) -> str:
        """Full GraphRAG pipeline: Neo4j + Qdrant → DeepSeek."""
        # 1. Structured knowledge from graph
        graph_results = self.graph_search(user_query)

        # 2. Semantic context from vectors
        semantic_results = self.semantic_search(user_query)

        # 3. Build context
        context = ""
        if graph_results:
            context += "📊 **Structured Knowledge (Neo4j):**\n"
            for r in graph_results:
                context += f"- {r['client']} → {r['problem']} → {r['solution']}\n"

        if semantic_results:
            context += "\n🔍 **Semantic Context (Qdrant):**\n"
            for r in semantic_results:
                context += f"- [{r['score']:.2f}] {r['text'][:200]}\n"

        # 4. Generate with DeepSeek
        prompt = f"""You are UAID AI, an expert AI solution architect.

User Query: {user_query}

{context if context else "No prior knowledge found in the knowledge base."}

Based on the available knowledge, provide a comprehensive AI solution. 
Include: 1) Analysis, 2) Recommended approach, 3) Implementation steps, 4) Expected outcomes.

Respond in English."""
        
        response = self.llm.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )
        return response.choices[0].message.content

    def close(self):
        self.neo4j.close()


# ── Demo ─────────────────────────────────────────────────
if __name__ == "__main__":
    rag = UaidGraphRAG()
    
    # Seed knowledge
    rag.add_client("UAID Test", "Technology")
    rag.add_solution("UAID Test", "Supply Chain Delays", "DeepSeek Demand Forecasting")
    rag.add_solution("UAID Test", "Data Silos", "Qdrant Semantic Search + Neo4j Graph")
    
    rag.add_document("doc1", "DeepSeek V4 is a powerful LLM for enterprise AI solutions with strong reasoning capabilities.")
    rag.add_document("doc2", "Qdrant provides fast vector similarity search for semantic retrieval in RAG pipelines.")
    rag.add_document("doc3", "Neo4j graph databases excel at modeling complex relationships in supply chain networks.")
    
    # Run query
    print("=" * 60)
    print("🚀 UAID GraphRAG — Hybrid Query Engine")
    print("=" * 60)
    
    result = rag.query("How can AI improve supply chain operations?")
    print(result)
    
    rag.close()
    print("\n✅ GraphRAG pipeline complete!")
