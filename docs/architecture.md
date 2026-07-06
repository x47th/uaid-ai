# UAID AI — Architecture

## System Overview

UAID AI is a multi-layered AI consultancy platform with 4 primary layers:

### Layer 1: Client Interface
- **Client Portal** (:5173) — Landing page, registration, problem submission, verdicts
- **Command Center** (:5000) — Admin dashboard for managing all services

### Layer 2: API Gateway
- **Horizon API** (:3000) — REST API for CRM (companies, contacts, deals, auth)
- **GraphRAG API** (:3001) — AI reasoning engine (Neo4j + Qdrant + DeepSeek)

### Layer 3: AI Engine  
- **Expert Team** — 8 world-class specialists with cross-critique
- **Complete Team** — 8-agent parallel pipeline (CEO → Deployer)
- **Knowledge Pipeline** — brain_sync, feedback_loop, embeddings

### Layer 4: Data Layer
- **Neo4j** (:7474) — Knowledge graph (34 nodes)
- **Qdrant** (:6333) — Vector search (23+ vectors)
- **PostgreSQL** — Relational data (dev: SQLite)
- **Redis** — Caching layer

## Data Flow

```
Client submits problem → GraphRAG queries Neo4j + Qdrant
                       → DeepSeek V4 generates analysis
                       → Verdict returned to client portal
                       → Knowledge stored back to Neo4j + Qdrant
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Command Center | 5000 | Admin dashboard |
| Client Portal | 5173 | Client-facing UI |
| UAID Dashboard | 8000 | System monitoring |
| Horizon API | 3000 | CRM backend |
| GraphRAG API | 3001 | AI engine |
| Neo4j | 7474 | Graph DB |
| Qdrant | 6333 | Vector DB |
