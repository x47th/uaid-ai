"""
DSPy-Optimized UAID Agent Pipeline
Uses DSPy to auto-optimize prompts for CrewAI agents
"""

import os
import dspy
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# ── Configure DSPy with DeepSeek ──────────────────────
lm = dspy.LM(
    model="openai/deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    api_base="https://api.deepseek.com/v1",
)
dspy.configure(lm=lm)

openai_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)


# ── DSPy Signatures ───────────────────────────────────

class ResearchProblem(dspy.Signature):
    """Research a business problem and find relevant AI solutions using structured knowledge."""
    problem = dspy.InputField(desc="The business problem to research")
    domain = dspy.InputField(desc="Industry or domain context")
    findings = dspy.OutputField(desc="Research findings with technologies, approaches, and prior solutions")
    confidence = dspy.OutputField(desc="Confidence score 0-100")


class DesignSolution(dspy.Signature):
    """Design a comprehensive AI solution architecture based on research findings."""
    findings = dspy.InputField(desc="Research findings from the analysis phase")
    constraints = dspy.InputField(desc="Technical or business constraints")
    architecture = dspy.OutputField(desc="Detailed solution architecture with components, data flow, and implementation")
    rationale = dspy.OutputField(desc="Why this architecture was chosen")


class WriteReport(dspy.Signature):
    """Create a professional, client-ready report from a solution architecture."""
    architecture = dspy.InputField(desc="Solution architecture to document")
    audience = dspy.InputField(desc="Target audience (technical, executive, mixed)")
    report = dspy.OutputField(desc="Polished, professional report with clear sections and next steps")


# ── DSPy Module (Equivalent to CrewAI pipeline) ───────

class UaidPipeline(dspy.Module):
    """3-stage UAID pipeline: Research → Design → Document"""

    def __init__(self):
        super().__init__()
        self.researcher = dspy.ChainOfThought(ResearchProblem)
        self.architect = dspy.ChainOfThought(DesignSolution)
        self.writer = dspy.ChainOfThought(WriteReport)

    def forward(self, problem: str, domain: str = "General", constraints: str = "None specified"):
        # Stage 1: Research
        research = self.researcher(problem=problem, domain=domain)

        # Stage 2: Architecture
        design = self.architect(
            findings=research.findings,
            constraints=constraints,
        )

        # Stage 3: Documentation
        report = self.writer(
            architecture=design.architecture,
            audience="mixed",
        )

        return dspy.Prediction(
            research=research.findings,
            confidence=research.confidence,
            architecture=design.architecture,
            rationale=design.rationale,
            report=report.report,
        )


# ── Optimizer: Auto-tune prompts ──────────────────────

def optimize_pipeline(examples_path: str = None):
    """Optimize the UAID pipeline using few-shot examples."""
    if examples_path and os.path.exists(examples_path):
        import json
        with open(examples_path) as f:
            data = json.load(f)

        trainset = [
            dspy.Example(
                problem=ex["problem"],
                domain=ex.get("domain", "General"),
                constraints=ex.get("constraints", "None"),
                findings=ex.get("findings", ""),
                architecture=ex.get("architecture", ""),
                report=ex.get("report", ""),
            ).with_inputs("problem", "domain", "constraints")
            for ex in data
        ]

        optimizer = dspy.BootstrapFewShot(
            metric=lambda pred, gold: len(pred.report) > 100,  # Basic quality metric
            max_bootstrapped_demos=3,
        )
        optimized = optimizer.compile(UaidPipeline(), trainset=trainset)
        return optimized

    return UaidPipeline()


# ── Run ───────────────────────────────────────────────

if __name__ == "__main__":
    pipeline = UaidPipeline()

    print("=" * 60)
    print("🧠 DSPy-Optimized UAID Pipeline")
    print("=" * 60)

    query = "How can AI improve supply chain operations for a logistics company?"
    print(f"\n📋 Query: {query}\n")

    result = pipeline(
        problem=query,
        domain="Logistics & Supply Chain",
        constraints="Must use existing Neo4j + Qdrant infrastructure, budget < $50k",
    )

    print(f"🔬 RESEARCH (confidence: {result.confidence}%):")
    print(result.research[:500])
    print(f"\n🏗️ ARCHITECTURE:")
    print(result.architecture[:500])
    print(f"\n📝 REPORT:")
    print(result.report[:500])
    print("\n✅ DSPy pipeline complete!")
