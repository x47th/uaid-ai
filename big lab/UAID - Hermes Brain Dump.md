# 🧠 UAID — Hermes Brain Dump

> This is a mirror of what Hermes remembers across sessions.
> Updated: 2026-07-05

## Active Skills (6)

| Skill | Purpose |
|-------|---------|
| `uaid-ai` | Full project reference — paths, services, gotchas |
| `loop-triage` | Daily health check of Neo4j, Qdrant, DeepSeek |
| `loop-verifier` | Maker/checker validation of loop outputs |
| `loop-constraints` | Runtime denylist + gate enforcement |
| `loop-budget` | Token tracking + kill switch |

## Memory Facts

### Project
- Root: `~/Desktop/biiiiiiiiiiiiigggggggggg labbbbbbbbbbbbb/`
- Code: `uaid_agents/`
- Vault: `big lab/`
- OS: Windows 10, shell: git-bash POSIX
- Python: 3.11.15 (`python`, not `python3`)

### Services
- Neo4j: `localhost:7474` / `bolt://localhost:7687` — neo4j / UAID2026secure!
- Qdrant: `localhost:6333` / `:6334` — no auth
- DeepSeek: `api.deepseek.com/v1` — key in `.env`, model: `deepseek-v4-flash`
- Docker: `C:\Program Files\Docker\Docker\resources\bin\docker.exe` v29.6.1

### Gotchas
- Qdrant v1.18 uses `query_points()` NOT `search()`
- GraphAI npm: `@receptron/graphai_cli` NOT `@receptron/graphai`
- Browserbase can't reach localhost
- `.env` files protected from `read_file`
- Docker password may get redacted in create commands

### External Knowledge
- **Loop Engineering** (cobusgreyling, 5.7k⭐): Agent orchestration patterns
- **CS249r ML Systems** (Harvard, 26.7k⭐): AI infrastructure engineering

### User Preferences
- User expects vault as live project dashboard
- Update Build Status after every session
- Don't wait to be asked — proactive updates

## Session Memory (non-durable)
- HR Guide project: COMPLETED (11 chapters + final doc)
- Documents at: `~/OneDrive/Desktop/unicorn hr progect/`
