# 📘 CS249r — Machine Learning Systems (Harvard)

> **Source:** [github.com/harvard-edge/cs249r_book](https://github.com/harvard-edge/cs249r_book)
> **Website:** [mlsysbook.ai](https://mlsysbook.ai)
> **Stars:** 26.7k | **Contributors:** 115 | **License:** MIT Press (2026)

## Core Philosophy

> "The world is rushing to build AI systems. It is not engineering them."

AI engineering = building **efficient, reliable, safe, robust** intelligent systems that operate in the real world — not just models in isolation.

> "The repository is the curriculum."

**Goal:** Train 100,000 learners this year → 1 million by 2030.

## Learning Loop

```
Read → Explore → Build → Model → Deploy → Practice → Teach
```

## Curriculum Components

| Component | Purpose | UAID Relevance |
|-----------|---------|----------------|
| **📖 Textbook (2 vols)** | Theory, mental models, quantitative reasoning | System design principles |
| **🔥 TinyTorch** | Build ML framework from scratch (20 modules) | Understanding inference internals |
| **🔬 Labs** | Interactive Marimo notebooks | Experiment with trade-offs |
| **🛠️ Hardware Kits** | Deploy to Arduino, Raspberry Pi | Edge deployment of UAID |
| **🔮 MLSys·im** | Infrastructure simulator (memory, network, scheduling) | Model UAID's resource usage |
| **💼 StaffML** | ML systems interview prep | Team skill-building |
| **🎓 Instructor Hub** | Syllabi, pedagogy, rubrics | Training UAID operators |
| **🧪 Socratiq** | AI-guided reading + spaced repetition | AI-augmented learning |
| **🏋️ MLPerf EDU** | Pedagogical benchmarks | Performance baselines |
| **🧩 Design Grammar** | Reason from primitives & constraints | System design methodology |

## Textbook Structure (Hennessy & Patterson model)

| Volume | Theme | Scope |
|--------|-------|-------|
| **📗 Vol I** | Build, Optimize, Deploy | Single-machine (1–8 GPUs). Foundations, optimization, deployment |
| **📘 Vol II** | Scale, Distribute, Govern | Multi-machine. Fault tolerance, governance, production scale |

## 🔗 Connection to UAID

This is the **engineering discipline** UAID needs underneath the orchestration:

```
        CS249r ML Systems
        (Infrastructure Physics)
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Neo4j  │ │ Qdrant │ │DeepSeek│
│ (Graph)│ │(Vector)│ │ (LLM)  │
└────────┘ └────────┘ └────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│ CrewAI │ │GraphRAG│ │ Loop   │
│ Agents │ │ Hybrid │ │  Eng   │
└────────┘ └────────┘ └────────┘
```

## Key Principles for UAID

1. **Model is a component, not the system** — DeepSeek is one piece of UAID
2. **Real-world constraints** — bandwidth, latency, power, failure rates
3. **Physics-first thinking** — understand what's happening under the hood
4. **Build from scratch** — TinyTorch approach: understand internals
5. **Test at scale** — MLSys·im for simulating production loads
