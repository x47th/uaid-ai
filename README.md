# 🧠 UAID AI — Universal AI Design Platform

> **If it's a problem, we'll find the AI fix. Period.**

UAID AI is a complete AI consultancy platform — 8 world-class expert agents that research, architect, secure, design, deploy, test, and document AI solutions. Powered by DeepSeek V4, Neo4j knowledge graphs, and Qdrant semantic search.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     UAID AI PLATFORM                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🌐 http://localhost:5000  — Command Center (Admin)        │
│  🌐 http://localhost:5173  — Client Portal                 │
│  🌐 http://localhost:8000  — UAID Dashboard                │
│                                                            │
│  📡 http://localhost:3000  — Horizon API (Swagger /docs)   │
│  📡 http://localhost:3001  — GraphRAG API (AI Engine)      │
│                                                            │
│  🗄️ http://localhost:7474  — Neo4j (Knowledge Graph)       │
│  🔍 http://localhost:6333  — Qdrant (Vector Search)        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/x47th/uaid-ai.git
cd uaid-ai

# Start infrastructure
docker-compose -f docker/docker-compose.yml up -d

# Start AI Engine (Python)
cd ai-engine && pip install -r requirements.txt
python complete_team.py "your query"

# Start APIs
cd backend && npm install && npx nest build && node dist/main.js

# Start Command Center
cd command-center && npm install && npx vite --port 5000

# Start Client Portal
cd client-portal && npm install && npx vite --port 5173
```

---

## 🧠 Expert Team (8 Agents)

| Agent | Expertise | Model |
|-------|-----------|-------|
| Dr. Amira Al-Rashid | AI Strategy (MIT, 15yr Fortune 500) | V4-Pro |
| Prof. Marcus Chen | Systems Architecture (ex-Google Distinguished Engineer) | V4-Pro |
| Dr. Sarah Kim | AI Research (Stanford PhD, 50+ papers) | V4-Pro |
| James Morrison | Security (ex-NSA, CISSP/OSCP/CEH) | V4-Flash |
| Elena Rodriguez | UX Design (ex-Stripe, ex-Linear) | V4-Flash |
| Raj Patel | DevOps (ex-Netflix, ex-Shopify) | V4-Flash |
| Maria Santos | QA (ex-Microsoft) | V4-Flash |
| David Park | Technical Writing (ex-AWS, ex-Vercel) | V4-Flash |

Run: `cd ai-engine && python expert_team.py "your problem"`

---

## 📁 Project Structure

```
uaid-ai/
├── command-center/      # Admin dashboard (React + Vite + Tailwind)
├── client-portal/       # Client-facing portal (React + Vite)
├── backend/             # NestJS APIs (Horizon CRM + GraphRAG)
├── ai-engine/           # Python agents + knowledge pipeline
├── frontend/            # Legacy CRM frontend
├── docker/              # Docker compose files
├── docs/                # Architecture, setup, API documentation
├── scripts/             # Deployment and utility scripts
├── .github/workflows/   # CI/CD pipelines
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Engine** | Python 3.11, DeepSeek V4, CrewAI, DSPy |
| **Backend** | NestJS 11, Prisma, JWT, Swagger |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Databases** | Neo4j (graph), Qdrant (vector), PostgreSQL, Redis |
| **Infrastructure** | Docker, GitHub Actions, Nginx |

---

## 📊 System Status

All services monitored with health checks. Health alert cron job runs every 2 hours.

---

## 📝 License

MIT — build, share, and improve freely.

**Built with DeepSeek V4 in the UAE** 🇦🇪