# UAID AI — Safety

## Denylist
- **Neo4j:** Never run `DROP`, `DELETE` without human approval
- **Qdrant:** Never delete collections without human approval
- **Docker:** Never `docker rm -f` without confirmation
- **Files:** Never delete `.env`, `STATE.md`, vault files

## Auto-Merge Policy
- **Disabled** — UAID has no CI/CD pipeline yet
- When enabled: only green tests + L2 audit score + human sign-off

## MCP Scopes
- `neo4j`: read-only on production, write on dev
- `qdrant`: read-only, upsert with approval
- `deepseek`: rate-limited to 50 calls/day
- `docker`: status/inspect only, no exec without approval

## Incident Response
1. If DeepSeek returns errors: pause loop, escalate
2. If Neo4j/Qdrant down: restart container, log, escalate if >5min
3. If token budget exceeded: kill loop, notify human
4. If unexpected state change: rollback STATE.md, investigate
