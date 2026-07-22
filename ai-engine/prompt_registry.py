"""
Prompt Registry — Version, A/B test, and rollback agent prompts.
"""
import json, os
from pathlib import Path
from datetime import datetime

PROMPTS_DIR = Path(__file__).parent / "prompts"
PROMPTS_DIR.mkdir(exist_ok=True)

DEFAULTS = {
    "ceo": "You are the CEO of UAID AI. Diagnose problems, delegate to specialists.",
    "researcher": "You are the Research Agent. Find technologies, case studies, best practices.",
    "architect": "You are the Architecture Agent. Design comprehensive technical solutions.",
    "builder": "You are the Builder Agent. Write production-ready code.",
    "validator": "You are the Validator Agent. Review for correctness and security.",
    "writer": "You are the Writer Agent. Create professional documentation.",
    "deployer": "You are the Deployer Agent. Create deployment plans.",
}

class PromptRegistry:
    def __init__(self):
        self._init_defaults()

    def _init_defaults(self):
        for name, prompt in DEFAULTS.items():
            f = PROMPTS_DIR / f"{name}_v1.txt"
            if not f.exists():
                f.write_text(prompt)

    def get(self, agent: str, version: int = None) -> str:
        f = PROMPTS_DIR / f"{agent}_v{version or self.latest(agent)}.txt"
        return f.read_text() if f.exists() else DEFAULTS.get(agent, "")

    def latest(self, agent: str) -> int:
        versions = [int(p.stem.split("_v")[1]) for p in PROMPTS_DIR.glob(f"{agent}_v*.txt")]
        return max(versions) if versions else 1

    def update(self, agent: str, new_prompt: str, changelog: str = ""):
        v = self.latest(agent) + 1
        f = PROMPTS_DIR / f"{agent}_v{v}.txt"
        f.write_text(new_prompt)
        # Write changelog
        log = PROMPTS_DIR / f"{agent}_changelog.md"
        with open(log, "a") as fh:
            fh.write(f"\n## v{v} — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n{changelog}\n")
        return v

    def rollback(self, agent: str, version: int):
        return self.get(agent, version)

    def list_versions(self, agent: str) -> list:
        return sorted([int(p.stem.split("_v")[1]) for p in PROMPTS_DIR.glob(f"{agent}_v*.txt")])


# ── Test ───────────────────────────────────────────────
if __name__ == "__main__":
    pr = PromptRegistry()
    print("📋 Prompt Registry:")
    for agent in ["ceo", "researcher", "architect"]:
        v = pr.latest(agent)
        print(f"   {agent}: v{v} — {pr.get(agent)[:60]}...")

    # Update a prompt
    pr.update("researcher", "Enhanced: Research with focus on UAE market, compliance, and Arabic language support.")
    print(f"\n✅ Updated researcher to v{pr.latest('researcher')}")
    print(f"   Versions: {pr.list_versions('researcher')}")
