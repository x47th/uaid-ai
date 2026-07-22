"""
Query → Knowledge Feedback Loop
Every GraphRAG query enriches the knowledge base with what was learned.
"""
import os, json
from datetime import datetime
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from embeddings import embed

NEO4J = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", os.getenv("NEO4J_PASSWORD", "UAID2026secure!")))
QDRANT = QdrantClient(host="localhost", port=6333)
COLLECTION = "uaid_knowledge"

def learn_from_query(query: str, response: str, source: str = "graphrag"):
    """Store query+response as new knowledge in Neo4j + Qdrant."""
    timestamp = datetime.now().isoformat()
    query_id = f"query_{hash(query) % (2**63)}"

    # Neo4j: Create Query node linked to existing knowledge
    try:
        with NEO4J.session() as s:
            s.run("""
                MERGE (q:Query {id: $id})
                SET q.text = $text, q.response = $resp, q.source = $src, q.timestamp = $ts
                WITH q
                MATCH (n:Note) WHERE n.name CONTAINS $kw OR $text CONTAINS n.name
                MERGE (q)-[:RELATED_TO]->(n)
            """, id=query_id, text=query[:200], resp=response[:1000], src=source, ts=timestamp, kw=query[:30])
        print(f"   ✅ Neo4j: Query node created")
    except Exception as e:
        print(f"   ⚠️ Neo4j: {e}")

    # Qdrant: Embed and store the query+response
    try:
        vec = embed(f"{query}\n{response[:2000]}")
        QDRANT.upsert(collection_name=COLLECTION, points=[
            PointStruct(id=abs(hash(query_id)) % (2**63), vector=vec, payload={
                "name": f"Query: {query[:80]}", "preview": response[:300],
                "source": source, "timestamp": timestamp,
            })
        ])
        print(f"   ✅ Qdrant: Knowledge vector stored")
    except Exception as e:
        print(f"   ⚠️ Qdrant: {e}")

    return {"query_id": query_id, "timestamp": timestamp}


# ── Test ───────────────────────────────────────────────
if __name__ == "__main__":
    result = learn_from_query(
        "How does AI improve customer service in UAE banks?",
        "AI improves banking through chatbots handling 80% of queries, fraud detection reducing losses by 60%, and personalized recommendations increasing customer satisfaction by 40%.",
        "manual_test"
    )
    print(f"\n✅ Feedback loop complete: {json.dumps(result, indent=2)}")
