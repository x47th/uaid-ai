# UAID AI — Loop Definition

## Pattern: Daily Triage
**Cadence:** Every 24h (report-only week 1)
**Tool:** Hermes Agent (CrewAI + DeepSeek)

## What This Loop Does
1. Check Neo4j for new nodes/relationships
2. Check Qdrant for collection health
3. Run a sample GraphRAG query
4. Update STATE.md with findings
5. Alert if any service is down

## Safety Gates
- **Week 1:** Report only — NO auto-fix
- **Week 2+:** Auto-fix with human approval
- **Never:** Modify production data, delete nodes, drop collections

## Budget
- **Token cap:** 10,000/day
- **API calls:** max 50/day
- **Kill switch:** If 3 consecutive errors, pause and alert

## Constraints
- Read-only on Neo4j (no CREATE/DELETE without approval)
- Read-only on Qdrant
- Max 5 DeepSeek calls per loop run
- Timeout: 120s per loop iteration

## Human Gates
- Any schema change → human approval
- New agent deployment → human approval
- Budget exceeded → human approval
- Service down > 5min → escalate to human

## MCP / Connectors
UAID uses direct API clients, not MCP:
- Neo4j: Python driver (`neo4j` package) via Bolt protocol
- Qdrant: Python client (`qdrant-client`) via HTTP
- DeepSeek: OpenAI SDK via HTTPS
- MCP not required for this pattern — direct API access is sufficient

## Worktree Isolation
- Docker containers provide service isolation
- Python venv isolates dependencies
- No Git worktrees needed — single-machine deployment
- Each loop run is stateless; state persists in STATE.md
