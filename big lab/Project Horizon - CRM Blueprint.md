# 🏢 Project Horizon — Custom SaaS CRM

> Full-stack capstone: multi-tenant CRM with AI agent orchestration

## Stack

| Layer | Technology | Skill |
|-------|-----------|-------|
| Frontend | React + Tailwind | State, routing, data tables |
| Backend | NestJS (TypeScript) | Modular API, DI, REST/GraphQL |
| Database | PostgreSQL + Prisma | Relational schema, migrations |
| AI Service | Python + CrewAI | Multi-agent orchestration |
| Infrastructure | Docker Compose | Containers, networking |

## Phases

### Phase 1: Multi-Tenancy Foundation
- `tenant_id` on every table
- NestJS guards auto-filter by JWT tenant

### Phase 2: Core CRM Entities
- Companies, Contacts, Deals
- Prisma models + REST/GraphQL endpoints

### Phase 3: Background Processing
- Redis + BullMQ queue
- CSV import workers

### Phase 4: AI Enrichment
- Python microservice with CrewAI
- Auto-research companies, extract firmographics
- Push enriched data back to Postgres

## 🔗 Connection to UAID

UAID already has CrewAI + DeepSeek + Docker. Project Horizon can:
- Use UAID's GraphRAG for company research
- Reuse our CrewAI pipeline (researcher → architect → writer)
- Share Docker infrastructure (Neo4j, Qdrant)
