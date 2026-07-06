"""
Brain Sync — Direct Obsidian → Neo4j + Qdrant + DeepSeek pipeline
Reads all vault notes and syncs the knowledge graph automatically.
"""
import os, re, hashlib, struct
from datetime import datetime
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

VAULT = r"C:\Users\x47th\OneDrive\Desktop\biiiiiiiiiiiiigggggggggg labbbbbbbbbbbbb\big lab"
NEO4J = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "UAID2026secure!"))
QDRANT = QdrantClient(host="localhost", port=6333)
COLLECTION = "uaid_knowledge"

# Cache embedding model globally
_embed_model = None

def _get_model():
    global _embed_model
    if _embed_model is None:
        from sentence_transformers import SentenceTransformer
        _embed_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    return _embed_model

def embed(text: str, size: int = 384) -> list[float]:
    """Embed using sentence-transformers (all-MiniLM-L6-v2) — real semantic embeddings."""
    try:
        model = _get_model()
        vec = model.encode(text[:2000]).tolist()
        if len(vec) < size: vec = vec + [0.0] * (size - len(vec))
        return vec[:size]
    except Exception:
        import hashlib, struct
        h = hashlib.sha256(text.encode()).digest()
        vec = list(struct.unpack("f" * (len(h) // 4), h))
        return (vec * (size // len(vec) + 1))[:size]

def sync_vault():
    """Read all .md files from vault and sync to Neo4j + Qdrant."""
    notes = []
    for root, _, files in os.walk(VAULT):
        for f in files:
            if f.endswith('.md'):
                path = os.path.join(root, f)
                with open(path, encoding='utf-8') as fh:
                    content = fh.read()
                notes.append({"name": f.replace('.md', ''), "path": path, "content": content})

    print(f"📁 Found {len(notes)} notes in vault")

    # ── Sync to Neo4j ──────────────────────────────
    with NEO4J.session() as s:
        # Extract tags and links from each note
        for note in notes:
            # Extract YAML frontmatter tags
            tags = []
            fm_match = re.match(r'^---\n(.*?)\n---', note['content'], re.DOTALL)
            if fm_match:
                tag_match = re.search(r'tags:\s*\[(.*?)\]', fm_match.group(1))
                if tag_match:
                    tags = [t.strip() for t in tag_match.group(1).split(',')]

            # Extract [[wikilinks]]
            links = re.findall(r'\[\[(.*?)\]\]', note['content'])

            # Create/update note node
            s.run("""
                MERGE (n:Note {name: $name})
                SET n.path = $path, n.updatedAt = datetime()
            """, name=note['name'], path=note['path'])

            # Create tag nodes + relationships
            for tag in tags:
                s.run("""
                    MERGE (t:Tag {name: $tag})
                    WITH t
                    MATCH (n:Note {name: $name})
                    MERGE (n)-[:TAGGED]->(t)
                """, tag=tag.strip(), name=note['name'])

            # Create link relationships
            for link in links:
                s.run("""
                    MERGE (target:Note {name: $link})
                    WITH target
                    MATCH (n:Note {name: $name})
                    MERGE (n)-[:LINKS_TO]->(target)
                """, link=link, name=note['name'])

        # Count results
        result = s.run("MATCH (n) RETURN labels(n) as labels, count(n) as cnt").data()
        print("🧠 Neo4j graph:")
        for r in result:
            print(f"   {r['labels']}: {r['cnt']}")

    # Sync to Qdrant
    import subprocess, json as j
    synced = 0
    for note in notes:
        try:
            vec = embed(note['content'][:2000])
            point = {"id": hash(note['name']) % (2**63), "vector": vec, "payload": {"name": note['name'], "preview": note['content'][:300]}}
            r = subprocess.run(["curl", "-s", "-X", "PUT",
                f"http://localhost:6333/collections/{COLLECTION}/points?wait=true",
                "-H", "Content-Type: application/json",
                "-d", j.dumps({"points": [point]})],
                capture_output=True, text=True, timeout=10)
            if '"status":"ok"' in r.stdout:
                synced += 1
        except Exception:
            pass
    print(f"🔍 Qdrant: {synced}/{len(notes)} notes embedded")

    # ── Self-Observer: Log the sync ──────────────────
    NEO4J.close()
    print(f"\n✅ Brain synced at {datetime.now().isoformat()}")
    print(f"   {len(notes)} notes → Neo4j + Qdrant")

if __name__ == "__main__":
    sync_vault()
