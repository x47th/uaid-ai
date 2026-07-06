# 📁 UAID — Project Files

## File Tree

```
biiiiiiiiiiiiigggggggggg labbbbbbbbbbbbb/
├── 📁 big lab/                          ← Obsidian Vault
│   ├── UAID - Knowledge Hub.md          ← 🧠 Main index
│   ├── UAID - System Architecture.md    ← How everything connects
│   ├── UAID - Project Files.md          ← This file
│   ├── UAID - Services & Credentials.md ← URLs, ports, passwords
│   ├── UAID - What Works.md             ← Tested & verified
│   ├── UAID - Gotchas & Pitfalls.md     ← Errors & fixes
│   ├── UAID - Build Status.md           ← Live progress
│   ├── UAID AI - Complete Build Guide.md← Original plan
│   ├── hello.md                         ← Test note
│   └── Welcome.md                       ← Default Obsidian note
│
├── 📁 uaid_agents/                      ← Main project
│   ├── .env                             ← DEEPSEEK_API_KEY
│   ├── .gitignore
│   ├── pyproject.toml                   ← Python project metadata
│   ├── main.py                          ← CrewAI 3-agent pipeline
│   ├── graphrag.py                      ← Neo4j + Qdrant + DeepSeek
│   ├── crew.jsonc                       ← Crew orchestration config
│   └── agents/
│       ├── researcher.jsonc             ← Knowledge Researcher agent
│       ├── architect.jsonc              ← Solution Architect agent
│       └── writer.jsonc                 ← Technical Writer agent
│
├── 📁 node_modules/                     ← GraphAI CLI deps
├── package.json                         ← Node.js project
└── package-lock.json
```

## File Purposes

### `main.py` — CrewAI Pipeline
- 3 agents: Researcher → Architect → Writer
- Sequential process
- CLI: `python main.py "query"`
- Imports: crewai, dotenv

### `graphrag.py` — Hybrid RAG Engine
- Class: `UaidGraphRAG`
- Methods: `add_client()`, `add_solution()`, `graph_search()`, `semantic_search()`, `add_document()`, `query()`
- Combines Neo4j Cypher queries + Qdrant vector search + DeepSeek generation
- Uses hash-based pseudo-embeddings (1024-dim)

### Agent Configs (`.jsonc`)
- JSON with comments
- Define role, goal, backstory, LLM model
- Researcher: allow_delegation=true
- Architect & Writer: allow_delegation=false

## Key Imports

| Package | Version | Used In |
|---------|---------|---------|
| crewai | 1.15.1 | main.py |
| openai | 2.44.0 | graphrag.py, main.py |
| neo4j | 6.2.0 | graphrag.py |
| qdrant-client | 1.18.0 | graphrag.py |
| python-dotenv | - | .env loading |
| @receptron/graphai_cli | 2.0.12 | Workflow automation |
