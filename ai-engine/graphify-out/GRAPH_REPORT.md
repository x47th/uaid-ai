# Graph Report - .  (2026-07-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 83 nodes · 92 edges · 14 communities (10 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_dspy_pipeline.py|dspy_pipeline.py]]
- [[_COMMUNITY_UaidCompleteTeam|UaidCompleteTeam]]
- [[_COMMUNITY_SelfObserver|SelfObserver]]
- [[_COMMUNITY_UaidGraphRAG|UaidGraphRAG]]
- [[_COMMUNITY_main.py|main.py]]
- [[_COMMUNITY_web_dashboard.py|web_dashboard.py]]
- [[_COMMUNITY_brain_sync.py|brain_sync.py]]
- [[_COMMUNITY_.embed|.embed]]
- [[_COMMUNITY_HealthMonitor|HealthMonitor]]
- [[_COMMUNITY_.query|.query]]
- [[_COMMUNITY_._init_qdrant|._init_qdrant]]
- [[_COMMUNITY_.add_solution|.add_solution]]
- [[_COMMUNITY_uaid_agents|uaid_agents]]

## God Nodes (most connected - your core abstractions)
1. `UaidGraphRAG` - 12 edges
2. `SelfObserver` - 8 edges
3. `UaidCompleteTeam` - 5 edges
4. `UaidPipeline` - 5 edges
5. `run_query()` - 4 edges
6. `HealthMonitor` - 4 edges
7. `embed()` - 3 edges
8. `sync_vault()` - 3 edges
9. `chat()` - 3 edges
10. `ResearchProblem` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (14 total, 4 thin omitted)

### Community 0 - "dspy_pipeline.py"
Cohesion: 0.19
Nodes (11): DesignSolution, optimize_pipeline(), DSPy-Optimized UAID Agent Pipeline Uses DSPy to auto-optimize prompts for CrewAI, Research a business problem and find relevant AI solutions using structured know, Design a comprehensive AI solution architecture based on research findings., Create a professional, client-ready report from a solution architecture., 3-stage UAID pipeline: Research → Design → Document, Optimize the UAID pipeline using few-shot examples. (+3 more)

### Community 1 - "UaidCompleteTeam"
Cohesion: 0.24
Nodes (6): chat(), UAID Complete Team — 8 specialized agents powered by DeepSeek API CEO → Research, Store learnings in Neo4j knowledge graph., Single call to DeepSeek., 8-agent pipeline: CEO → full team → delivery, UaidCompleteTeam

### Community 2 - "SelfObserver"
Cohesion: 0.31
Nodes (3): Logs every action, reflects on patterns, generates improvement lessons., Analyze recent actions and generate lessons., SelfObserver

### Community 3 - "UaidGraphRAG"
Cohesion: 0.29
Nodes (4): UAID GraphRAG — Hybrid Retrieval-Augmented Generation Connects Neo4j (structured, Hybrid RAG engine: Neo4j graph + Qdrant vectors + DeepSeek LLM., Add a client node to the knowledge graph., UaidGraphRAG

### Community 4 - "main.py"
Cohesion: 0.38
Nodes (6): create_agents(), UAID AI — Main entry point for the CrewAI orchestration system., Create and return the three UAID agents., Run the UAID agent crew on a user query., run(), run_query()

### Community 5 - "web_dashboard.py"
Cohesion: 0.29
Nodes (3): Request, chat(), UAID Web Dashboard — Fast web UI for the entire UAID system

### Community 6 - "brain_sync.py"
Cohesion: 0.40
Nodes (5): embed(), Brain Sync — Direct Obsidian → Neo4j + Qdrant + DeepSeek pipeline Reads all vaul, Pseudo-embedding — upgrade to DeepSeek embeddings for production., Read all .md files from vault and sync to Neo4j + Qdrant., sync_vault()

### Community 7 - ".embed"
Cohesion: 0.33
Nodes (3): Semantic search in Qdrant vector store., Embed text using DeepSeek (placeholder — uses hash-based sim)., Index a document in Qdrant.

### Community 8 - "HealthMonitor"
Cohesion: 0.40
Nodes (3): HealthMonitor, UAID Self-Observer + Health Monitor Learns from every action, monitors all servi, Pings all services, returns status, can trigger alerts.

## Knowledge Gaps
- **1 isolated node(s):** `uaid_agents`
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UaidGraphRAG` connect `UaidGraphRAG` to `.query`, `._init_qdrant`, `.add_solution`, `.embed`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `SelfObserver` connect `SelfObserver` to `HealthMonitor`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `Brain Sync — Direct Obsidian → Neo4j + Qdrant + DeepSeek pipeline Reads all vaul`, `Pseudo-embedding — upgrade to DeepSeek embeddings for production.`, `Read all .md files from vault and sync to Neo4j + Qdrant.` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._