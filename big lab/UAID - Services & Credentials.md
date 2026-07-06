# 🔐 UAID — Services & Credentials

## Running Services

| Service | URL | Port | Auth | Container |
|---------|-----|------|------|-----------|
| Neo4j Browser | `http://localhost:7474` | 7474 | neo4j / UAID2026secure! | neo4j |
| Neo4j Bolt | `bolt://localhost:7687` | 7687 | neo4j / UAID2026secure! | neo4j |
| Qdrant API | `http://localhost:6333` | 6333 | None | qdrant |
| Qdrant gRPC | `http://localhost:6334` | 6334 | None | qdrant |

## API Keys

| Service | Key | Where |
|---------|-----|-------|
| DeepSeek API | `DEEPSEEK_API_KEY` | `uaid_agents/.env` |
| Neo4j Password | `UAID2026secure!` | Docker env / code |
| Qdrant | No auth | — |

## Docker Commands

```bash
# Add Docker to PATH first:
export PATH="$PATH:/c/Program Files/Docker/Docker/resources/bin"

# Start all:
docker start neo4j qdrant

# Stop all:
docker stop neo4j qdrant

# Remove & recreate:
docker rm -f neo4j
docker run -d --name neo4j -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/UAID2026secure! \
  --restart unless-stopped neo4j:latest

# Status:
docker ps
```

## Environment Variables (`.env`)

```
DEEPSEEK_API_KEY=sk-b274...
```

## DeepSeek API Details

- **Base URL:** `https://api.deepseek.com/v1`
- **Model:** `deepseek-v4-flash`
- **Compatible with:** OpenAI SDK
- **Note:** `deepseek-chat` and `deepseek-reasoner` deprecated as of July 2026

## Neo4j Database

- **Version:** 2026.05.0 Community Edition
- **Graph nodes:** Client, Problem, Solution
- **Relationships:** HAS_PROBLEM, SOLVED_BY
- **Test data:** UAID Test → Supply Chain Delays → DeepSeek Demand Forecasting

## Qdrant Collections

| Collection | Vectors | Dimension | Distance |
|-----------|---------|-----------|----------|
| uaid_knowledge | 6 | 1024 | Cosine |
