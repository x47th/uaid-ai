# UAID AI — Loop Constraints

## Denylist Paths
- `uaid_agents/.env` — never read/modify by automated loop
- `big lab/` — read-only (vault is human-managed)
- `node_modules/` — never touch

## Push / Merge Rules
- No auto-push to main
- Feature branches only
- PR required for: schema changes, new agents, constraint changes

## Human Gates
| Gate | Trigger | Action |
|------|---------|--------|
| Schema change | Any Neo4j CREATE/DROP | Human approval |
| Budget exceeded | >10k tokens/day | Kill + notify |
| 3 consecutive errors | Any component | Pause loop |
| Service down | >5 min | Escalate |
| State drift | loop-sync detects mismatch | Human review |

## Loop-Specific Constraints
- `loop-triage`: report-only first week
- `loop-verify`: never auto-merge
- `loop-fix`: patch-size limit (50 lines)
