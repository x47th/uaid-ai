"""
UAID Complete Team — 8 specialized agents powered by DeepSeek API
CEO → Researcher → Architect → Builder → Validator → Writer → Deployer → Learner
Parallel execution for: {Researcher+Validator, Builder+Writer, Writer+Deployer}
"""
import os, json, asyncio
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from openai import OpenAI
from neo4j import GraphDatabase
from qdrant_client import QdrantClient

load_dotenv()

# ── Clients ────────────────────────────────────────────
llm_pro = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
llm_fast = llm_pro  # Same API, model selection per call
neo4j = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", os.getenv("NEO4J_PASSWORD", "UAID2026secure!")))
qdrant = QdrantClient(host="localhost", port=6333)
WORKDIR = os.path.dirname(os.path.abspath(__file__))


def chat(model: str, system: str, user: str, max_tokens=800) -> str:
    """Single call to DeepSeek."""
    r = llm_pro.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=max_tokens,
    )
    return r.choices[0].message.content


# ── AGENT PROMTS ─────────────────────────────────────

CEO_PROMPT = """You are the CEO of UAID AI, the leading AI consultancy in the UAE.
Your role: understand client problems deeply, diagnose root causes, design solution strategy, delegate to specialists.
Output: A clear action plan with tasks assigned to Researcher, Architect, Builder, Validator, Writer, Deployer.
Format your response as JSON: {"diagnosis":"...", "plan":["step1","step2"], "assignments":{"researcher":"..."}}"""

RESEARCHER_PROMPT = """You are the Research Agent for UAID AI.
Research the given topic thoroughly. Find relevant technologies, case studies, best practices, and industry data.
Output: A detailed research report with 3-5 key findings and sources."""

ARCHITECT_PROMPT = """You are the Architecture Agent for UAID AI.
Design a comprehensive technical solution. Include: system components, data flow, technology stack, API design, deployment strategy.
Output: A structured architecture document with clear sections."""

BUILDER_PROMPT = """You are the Builder Agent for UAID AI.
Write production-ready code based on the architecture. Include all necessary files with proper structure.
Output: Complete code with file paths and explanations."""

VALIDATOR_PROMPT = """You are the Validator Agent for UAID AI.
Review the solution for correctness, security, performance, and completeness. Find bugs and suggest improvements.
Output: A validation report with PASS/FAIL status for each check."""

WRITER_PROMPT = """You are the Writer Agent for UAID AI.
Create professional documentation: README, API docs, client proposal, and user guide.
Output: Well-structured documentation in markdown format."""

DEPLOYER_PROMPT = """You are the Deployer Agent for UAID AI.
Create deployment instructions: Docker setup, environment variables, cloud configuration, monitoring.
Output: Deployment plan and docker-compose.yml if needed."""


# ── COMPLETE TEAM PIPELINE ────────────────────────────

class UaidCompleteTeam:
    """8-agent pipeline: CEO → full team → delivery. Error recovery built-in."""

    def __init__(self, client_name: str = None):
        self.log = []
        self.max_retries = 2
        self.session = None
        if client_name:
            from client_session import ClientSession
            self.session = ClientSession(client_name)

    def _safe_chat(self, model: str, system: str, user: str, label: str = "agent") -> str:
        """Chat with retry on failure."""
        for attempt in range(self.max_retries + 1):
            try:
                return chat(model, system, user)
            except Exception as e:
                if attempt < self.max_retries:
                    print(f"   ⚠️ {label} attempt {attempt+1} failed, retrying...")
                    import time; time.sleep(1)
                else:
                    print(f"   ❌ {label} failed after {self.max_retries+1} attempts: {e}")
                    return f"[Error: {str(e)[:100]}]"
        return ""

    def run(self, client_problem: str) -> dict:
        print("=" * 60)
        print("🧠 UAID COMPLETE TEAM — Processing (Parallel)")
        print("=" * 60)

        # 1. CEO: Strategy (must run first)
        print("\n[1/8] 👔 CEO Agent (deepseek-v4-pro)")
        
        # Inject client session context if available
        session_context = ""
        if self.session:
            recent = self.session.recall()
            if recent:
                session_context = f"\nPrevious context with this client: {json.dumps(recent[-5:], default=str)}"
        
        ceo = self._safe_chat("deepseek-v4-pro", CEO_PROMPT,
            f"Client problem: {client_problem}{session_context}\nAnalyze and create an action plan.")
        print(f"   ✅ Strategy ready")
        
        # Remember this interaction
        if self.session:
            try:
                self.session.remember("last_problem", client_problem[:200])
                self.session.remember("ceo_diagnosis", ceo[:300])
            except Exception:
                pass

        # 2-3. Researcher + Architect in PARALLEL
        print("\n[2-3/8] 🔬🏗️ Researcher + Architect (parallel)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(chat, "deepseek-v4-flash", RESEARCHER_PROMPT,
                f"Research: {client_problem}\nCEO: {ceo[:300]}")
            f2 = ex.submit(chat, "deepseek-v4-pro", ARCHITECT_PROMPT,
                f"Architect for: {client_problem}\nCEO: {ceo[:300]}")
            research = f1.result()
            arch = f2.result()
        print(f"   ✅ Research: {len(research)} chars | Architecture: {len(arch)} chars")

        # 4-5. Builder + Validator in PARALLEL
        print("\n[4-5/8] 🔧✅ Builder + Validator (parallel)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(chat, "deepseek-v4-flash", BUILDER_PROMPT,
                f"Build based on architecture:\n{arch[:800]}")
            f2 = ex.submit(chat, "deepseek-v4-flash", VALIDATOR_PROMPT,
                f"Validate:\nResearch: {research[:300]}\nArchitecture: {arch[:400]}")
            build = f1.result()
            validate = f2.result()
        print(f"   ✅ Code: {len(build)} chars | Validation: {len(validate)} chars")

        # 6-7. Writer + Deployer in PARALLEL
        print("\n[6-7/8] 📝🚀 Writer + Deployer (parallel)")
        with ThreadPoolExecutor(max_workers=2) as ex:
            f1 = ex.submit(chat, "deepseek-v4-flash", WRITER_PROMPT,
                f"Document:\nProblem: {client_problem}\nArch: {arch[:500]}\nValidation: {validate[:300]}")
            f2 = ex.submit(chat, "deepseek-v4-flash", DEPLOYER_PROMPT,
                f"Deploy:\nArch: {arch[:400]}\nCode: {build[:300]}")
            docs = f1.result()
            deploy = f2.result()
        print(f"   ✅ Docs: {len(docs)} chars | Deploy: {len(deploy)} chars")

        # 8. Learner: Update Brain
        print("\n[8/8] 🧠 Learner — Syncing to brain...")
        self._sync_to_brain(client_problem, research)

        print("\n" + "=" * 60)
        print("✅ UAID COMPLETE TEAM — DELIVERY COMPLETE (3x parallel batches)")
        print("=" * 60)

        return {
            "ceo_plan": ceo, "research": research, "architecture": arch,
            "code": build, "validation": validate, "documentation": docs, "deployment": deploy,
        }

    def _sync_to_brain(self, problem: str, research: str):
        """Store learnings in Neo4j knowledge graph."""
        try:
            with neo4j.session() as s:
                s.run("MERGE (p:Problem {name: $name}) SET p.research = $research",
                    name=problem[:100], research=research[:500])
            print("   ✅ Brain updated")
        except Exception as e:
            print(f"   ⚠️ Brain sync skipped: {e}")


# ── CLI ────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "How can AI automate invoice processing for a logistics company in the UAE?"
    team = UaidCompleteTeam()
    result = team.run(query)

    # Save full output
    out = os.path.join(WORKDIR, "team_output.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"\n📁 Full output saved to {out}")
