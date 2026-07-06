<p align="center">
  <h1 align="center">🧠 UAID AI</h1>
  <p align="center">Universal AI Design — Complete Multi-Agent Consultancy Platform</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue" alt="Python">
  <img src="https://img.shields.io/badge/NestJS-11-red" alt="NestJS">
  <img src="https://img.shields.io/badge/React-19-cyan" alt="React">
  <img src="https://img.shields.io/badge/DeepSeek-V4-green" alt="DeepSeek">
  <img src="https://img.shields.io/badge/Neo4j-graph-blue" alt="Neo4j">
  <img src="https://img.shields.io/badge/Qdrant-vectors-orange" alt="Qdrant">
  <img src="https://img.shields.io/badge/status-production-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

---

## What is UAID AI?

UAID AI is a **complete AI consultancy platform** — an 8-agent team that researches, architects, builds, validates, documents, and deploys solutions. It combines knowledge graphs, vector search, and LLM reasoning into a self-evolving intelligence system.

```
👔 CEO → 🔬 Researcher → 🏗️ Architect → 🔧 Builder → ✅ Validator → 📝 Writer → 🚀 Deployer → 🧠 Learner
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UAID AI PLATFORM                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🧠 AI ENGINE (17 Python modules)                       │
│  ├── complete_team.py    → 8-agent parallel pipeline    │
│  ├── graphrag.py         → Neo4j + Qdrant + DeepSeek    │
│  ├── dspy_pipeline.py    → Auto-optimized prompts       │
│  ├── brain_sync.py       → Obsidian ←→ Neo4j ←→ Qdrant  │
│  ├── feedback_loop.py    → Query → knowledge feedback   │
│  ├── self_observer.py    → Health monitoring            │
│  ├── cost_tracker.py     → API cost tracking            │
│  ├── prompt_registry.py  → A/B test prompts             │
│  ├── analytics.py        → Usage analytics              │
│  └── ... more                                            │
│                                                         │
│  🏢 HORIZON CRM (Full Stack SaaS)                       │
│  ├── project-horizon/     → NestJS API (port 3000)      │
│  └── horizon-frontend/    → React + Tailwind (port 5173) │
│                                                         │
│  📚 KNOWLEDGE BASE                                      │
│  ├── big lab/             → 31 Obsidian vault notes     │
│  ├── Neo4j                → 32 graph nodes              │
│  └── Qdrant               → 23 semantic vectors         │
│                                                         │
│  🐳 INFRASTRUCTURE                                      │
│  ├── docker-compose.yml   → 4 services                  │
│  ├── Dockerfiles           → Multi-stage builds         │
│  └── .github/workflows/   → CI/CD pipeline              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+, Node.js 22+, Docker
- DeepSeek API key ([get one](https://platform.deepseek.com))

### 1. Clone & Setup
```bash
git clone https://github.com/x47th/uaid-ai.git
cd uaid-ai
```

### 2. Start Infrastructure
```bash
docker-compose up -d neo4j qdrant
```

### 3. Run the AI Engine
```bash
cd uaid_agents
cp .env.example .env  # edit with your DeepSeek key
pip install -r requirements.txt
python complete_team.py "How can AI improve supply chain?"
```

### 4. Start Horizon CRM
```bash
cd project-horizon
npm install && npx prisma generate && npm run build
node dist/main.js  # API at http://localhost:3000
```

### 5. Start Horizon Frontend
```bash
cd horizon-frontend
npm install && npx vite  # UI at http://localhost:5173
```

---

## 🌐 Live URLs (when running)

| URL | Service |
|-----|---------|
| `http://localhost:8080` | Open WebUI — Chat with DeepSeek |
| `http://localhost:8000` | UAID Dashboard — Live graph + status |
| `http://localhost:5173` | Horizon CRM — Login: test@horizon.com / test123 |
| `http://localhost:3000/api/docs` | Horizon API — Swagger documentation |
| `http://localhost:7474` | Neo4j Browser — 32 nodes |
| `http://localhost:6333/dashboard` | Qdrant Dashboard — 23 vectors |

---

## 📁 Project Structure

```python
uaid-agents/
├── uaid_agents/          # AI Engine (17 modules)
│   ├── complete_team.py  # 8-agent parallel pipeline
│   ├── graphrag.py       # Hybrid RAG (Neo4j + Qdrant + DeepSeek)
│   ├── dspy_pipeline.py  # Auto-optimized prompts
│   ├── brain_sync.py     # Vault → Neo4j + Qdrant sync
│   ├── brain_writeback.py # Neo4j → Vault writeback
│   ├── feedback_loop.py  # Query → knowledge feedback
│   ├── self_observer.py  # Health + action monitoring
│   ├── cost_tracker.py   # DeepSeek cost tracking
│   ├── prompt_registry.py # Prompt versioning + A/B testing
│   ├── analytics.py      # Usage analytics
│   ├── client_session.py # Persistent client memory
│   ├── embeddings.py     # Shared embedding model
│   ├── deepseek-tui.py   # Terminal chat
│   ├── web_dashboard.py  # FastAPI dashboard
│   ├── main.py           # CrewAI pipeline
│   └── agents/           # Agent configs (JSONC)
│
├── project-horizon/      # NestJS Backend
│   ├── src/
│   │   ├── auth/         # JWT authentication
│   │   ├── crm/          # Companies, Contacts, Deals
│   │   ├── ai/           # DeepSeek enrichment
│   │   ├── health/       # Health checks
│   │   └── prisma/       # Database service
│   └── prisma/schema.prisma
│
├── horizon-frontend/     # React Frontend
│   └── src/pages/        # Dashboard, Companies, Contacts, Deals
│
├── big lab/              # Obsidian Vault (31 notes)
│   ├── UAID - Knowledge Hub.md
│   ├── UAID - System Architecture.md
│   ├── UAID - Deep Gap Analysis.md
│   └── ... more
│
├── docker-compose.yml    # Infrastructure stack
├── .github/workflows/    # CI/CD
└── AGENTS.md             # Agent guidelines
```

---

## 🔧 CLI Tools

```bash
cd uaid_agents

# 8-agent pipeline (CEO → Deployer)
python complete_team.py "your client problem"

# GraphRAG query (Neo4j + Qdrant + DeepSeek)
python graphrag.py

# DSPy auto-optimized pipeline
python dspy_pipeline.py

# Sync vault → brain
python brain_sync.py

# Health check all services
python self_observer.py

# Terminal chat with DeepSeek
python deepseek-tui.py
```

---

## 🧠 Key Features

| Feature | Status |
|---------|--------|
| **8-Agent Parallel Team** | ✅ CEO → Researcher → Architect → Builder → Validator → Writer → Deployer → Learner |
| **GraphRAG** | ✅ Neo4j graph + Qdrant vectors + DeepSeek reasoning |
| **Real Embeddings** | ✅ 384-dim semantic vectors (all-MiniLM-L6-v2) |
| **DSPy Optimization** | ✅ Auto-optimized prompts via BootstrapFewShot |
| **Brain Sync** | ✅ Obsidian ↔ Neo4j ↔ Qdrant bidirectional |
| **Knowledge Feedback** | ✅ Every query enriches the knowledge base |
| **Cost Tracking** | ✅ Per-client, per-model DeepSeek cost monitoring |
| **Prompt Versioning** | ✅ A/B test, rollback, changelog for all prompts |
| **Client Sessions** | ✅ Persistent memory across runs |
| **Horizon CRM** | ✅ Full-stack SaaS (NestJS + React + Prisma) |
| **Security** | ✅ Helmet, rate limiting, JWT, input validation |
| **Health Monitoring** | ✅ /health, /ready, /live, Docker health checks |
| **CI/CD** | ✅ GitHub Actions (test → build) |
| **Self-Evolution** | ✅ Hermes auto-creates skills from sessions |

---

## 🛠️ Tech Stack

```yaml
AI Engine:
  - Python 3.11
  - DeepSeek V4 (Pro + Flash)
  - CrewAI + DSPy
  - Neo4j (graph database)
  - Qdrant (vector database)
  - sentence-transformers (embeddings)

Backend:
  - NestJS 11
  - Prisma ORM
  - JWT + Passport
  - Swagger/OpenAPI
  - Winston (logging)

Frontend:
  - React 19
  - Vite + Tailwind CSS
  - Lucide icons
  - Axios

Infrastructure:
  - Docker + Docker Compose
  - PostgreSQL 16 / SQLite (dev)
  - Redis 7
  - Nginx
```

---

## 📊 What's in the Knowledge Base

| Store | Content |
|-------|---------|
| **Neo4j** | 32 nodes (26 Notes, 3 Problems, 2 Solutions, 1 Client) |
| **Qdrant** | 23 vectors × 384-dim (real semantic embeddings) |
| **Obsidian** | 31 vault notes covering architecture, gaps, guides, status |
| **Graphify** | 83 code nodes, 92 edges, 14 communities |

---

## 📝 License

MIT — build, share, and improve freely.

---

**Built with DeepSeek V4 in the UAE** 🇦🇪