# 🔄 Loop Engineering

> **Source:** [github.com/cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering)
> **License:** MIT | **Stars:** 5.7k | **Latest:** v1.5.0 (June 2026)

## Core Philosophy

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents." — Peter Steinberger

> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops." — Boris Cherny (Head of Claude Code, Anthropic)

## The Five Building Blocks + Memory

| Primitive | Role | UAID Relevance |
|-----------|------|----------------|
| **Automations / Scheduling** | Discovery + triage on a cadence | Cron jobs for UAID monitoring |
| **Worktrees** | Safe parallel execution | Multi-agent CrewAI pipelines |
| **Skills** | Persistent project knowledge | Our Obsidian vault & uaid-ai skill |
| **Plugins & Connectors** | Reach into real tools (MCP) | Neo4j, Qdrant, DeepSeek APIs |
| **Sub-agents** | Maker/checker split | Researcher → Architect → Writer |
| **+ Memory / State** | Durable spine outside conversation | STATE.md, Obsidian notes |

## CLI Tools (npm)

```bash
# Audit your loop readiness
npx @cobusgreyling/loop-audit . --suggest

# Scaffold loop patterns
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok

# Estimate token costs
npx @cobusgreyling/loop-cost --pattern ci-sweeper --cadence 15m

# Detect drift between STATE.md and LOOP.md
npx @cobusgreyling/loop-sync .

# Stateful memory for long-running loops
npx @cobusgreyling/loop-context
```

## Production Patterns (7 available)

| Pattern | Cadence | What It Does |
|---------|---------|--------------|
| **Daily Triage** | 1d–2h | Issue/PR discovery & triage |
| **PR Babysitter** | 5–15m | Auto reviews, merge checks |
| **CI Sweeper** | 5–15m | Auto-fix flaky CI failures |
| **Dependency Sweeper** | 6h–1d | Bump dependencies safely |
| **Changelog Drafter** | 1d/tag | Generate changelogs from commits |
| **Post-Merge Cleanup** | 1d–6h | Clean up after merges |
| **Issue Triage** | 2h–1d | Labels, assigns, dedup |

## 🔗 Connection to UAID

Loop Engineering is the **orchestration layer** UAID needs:

```
Loop Engineering Patterns
        │
        ▼
┌───────────────────────────────┐
│  UAID Agent Orchestration     │
│  ┌─────────┐  ┌────────────┐  │
│  │ CrewAI  │  │  GraphAI   │  │
│  │ 3-agent │  │ Workflows  │  │
│  └─────────┘  └────────────┘  │
│         │           │         │
│         ▼           ▼         │
│  ┌─────────────────────────┐  │
│  │  Neo4j + Qdrant +       │  │
│  │  DeepSeek (GraphRAG)    │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

## Ideas for UAID Integration

1. **Daily Triage Loop** — Auto-scan Neo4j for new problems, route to CrewAI
2. **Loop Audit** — Score UAID's agent readiness
3. **STATE.md** — Durable state file for long-running UAID loops
4. **Cost tracking** — Estimate DeepSeek token spend per pattern
