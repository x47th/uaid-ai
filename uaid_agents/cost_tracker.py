"""
Cost Tracker — monitors DeepSeek API usage per query, per client, per session.
"""
import json, os, time
from pathlib import Path
from datetime import datetime

COST_LOG = Path(__file__).parent / "cost_log.json"

# DeepSeek V4 pricing (approximate per 1M tokens)
PRICING = {
    "deepseek-v4-pro": {"input": 0.55, "output": 2.19},
    "deepseek-v4-flash": {"input": 0.14, "output": 0.28},
}

class CostTracker:
    def __init__(self, client: str = "default"):
        self.client = client
        self.session_start = datetime.now().isoformat()
        self.calls = []
        self._load()

    def _load(self):
        if COST_LOG.exists():
            self.history = json.loads(COST_LOG.read_text())
        else:
            self.history = {"sessions": [], "total_cost": 0, "total_tokens": 0}

    def _save(self):
        COST_LOG.write_text(json.dumps(self.history, indent=2, default=str))

    def track(self, model: str, prompt: str, response: str):
        """Record a single API call with estimated cost."""
        in_tokens = len(prompt) // 4  # rough estimate
        out_tokens = len(response) // 4
        pricing = PRICING.get(model, PRICING["deepseek-v4-flash"])
        cost = (in_tokens / 1_000_000) * pricing["input"] + (out_tokens / 1_000_000) * pricing["output"]

        call = {
            "model": model, "input_tokens": in_tokens, "output_tokens": out_tokens,
            "cost": round(cost, 6), "timestamp": datetime.now().isoformat(), "client": self.client,
        }
        self.calls.append(call)
        self.history["total_cost"] += cost
        self.history["total_tokens"] += in_tokens + out_tokens

    def summary(self) -> dict:
        total = sum(c["cost"] for c in self.calls)
        tokens = sum(c["input_tokens"] + c["output_tokens"] for c in self.calls)
        return {"calls": len(self.calls), "cost": round(total, 4), "tokens": tokens, "client": self.client}

    def close(self):
        self.history["sessions"].append({
            "client": self.client, "start": self.session_start, "end": datetime.now().isoformat(),
            "calls": len(self.calls), "cost": round(sum(c["cost"] for c in self.calls), 4),
        })
        self._save()


# ── Run ───────────────────────────────────────────────
if __name__ == "__main__":
    ct = CostTracker("demo")
    ct.track("deepseek-v4-pro", "Analyze supply chain..." * 10, "Here is the analysis..." * 20)
    ct.track("deepseek-v4-flash", "Build the code..." * 5, "Code generated..." * 30)
    print(f"📊 Cost Summary: {json.dumps(ct.summary(), indent=2)}")
    ct.close()
    print(f"💰 Total all-time: ${ct.history['total_cost']:.4f} | {ct.history['total_tokens']:,} tokens")
