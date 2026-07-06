# UAID AI — Agent Guidelines

## Project Overview
UAID AI is a multi-agent AI orchestration system for business solution design.
Stack: Neo4j (graph) + Qdrant (vectors) + DeepSeek V4 (LLM) + CrewAI (agents).

## Build & Test
```bash
# Verify all services
docker ps  # neo4j + qdrant should be Up

# Test GraphRAG
cd uaid_agents && python graphrag.py

# Test CrewAI
cd uaid_agents && python main.py "test query"

# Test DeepSeek TUI
cd uaid_agents && python deepseek-tui.py
```

## Code Conventions
- Python 3.11, POSIX shell (git-bash)
- `.env` for secrets (never commit)
- Agent configs in `agents/*.jsonc` (JSON with comments)
- All imports at top, config as constants
- Type hints preferred but not required

## Review Norms
- Every change updates `UAID - Build Status.md` in vault
- Every error adds to `UAID - Gotchas & Pitfalls.md`
- Memory tool saves durable facts; Obsidian vault is the source of truth

## Branch Strategy
- `main` — stable, tested
- Feature branches for new agents/patterns
- PR required for schema changes
