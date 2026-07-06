# 🔗 Graphify — Knowledge Graph for Codebases

> **Source:** [github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)
> **Stars:** 77.8k | **License:** MIT | **Python:** 3.10+

## What It Does
`/graphify .` — maps your entire project into a queryable knowledge graph.
Code, docs, PDFs, images, videos → graph nodes + connections.

## Output
```
graphify-out/
├── graph.html       ← Interactive visualization
├── GRAPH_REPORT.md  ← Key concepts + suggested questions
└── graph.json       ← Full structured graph
```

## Benchmarks
- 10x better retrieval than mem0
- 76% on LongMemEval-S
- Zero LLM credits for code extraction
- Beats grep+read on 1M LOC codebases

## 🔗 Connection to UAID
- Graphify can map UAID's codebase → Neo4j
- Complements our `brain_sync.py` for vault notes
- Combined: code graph + knowledge graph = complete brain
