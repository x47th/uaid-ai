"""
Client Session Memory — Persistent multi-session client tracking.
Remembers context across complete_team runs for the same client.
"""
import json, os
from datetime import datetime
from pathlib import Path
from neo4j import GraphDatabase

SESSIONS_DIR = Path(__file__).parent / "sessions"
NEO4J = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", os.getenv("NEO4J_PASSWORD", "UAID2026secure!")))

class ClientSession:
    def __init__(self, client_name: str, project: str = "default"):
        self.client = client_name
        self.project = project
        self.session_id = f"{client_name}_{project}_{datetime.now().strftime('%Y%m%d_%H%M')}"
        self.context = self._load_or_create()

    def _load_or_create(self) -> dict:
        # Check Neo4j for existing client data
        try:
            with NEO4J.session() as s:
                r = s.run("MATCH (c:Client {name: $name})-[*1..3]-(related) RETURN c, collect(distinct labels(related)) as types",
                    name=self.client).single()
                if r:
                    return {"existing": True, "related_types": r["types"], "created": datetime.now().isoformat()}
        except:
            pass

        SESSIONS_DIR.mkdir(exist_ok=True)
        session_file = SESSIONS_DIR / f"{self.session_id}.json"
        ctx = {"client": self.client, "project": self.project, "history": [], "decisions": [], "created": datetime.now().isoformat()}
        session_file.write_text(json.dumps(ctx, indent=2))
        return ctx

    def remember(self, key: str, value: any):
        self.context["history"].append({"key": key, "value": value, "ts": datetime.now().isoformat()})
        self._save()

    def recall(self, key: str = None) -> list:
        if key:
            return [h for h in self.context["history"] if key in h["key"]]
        return self.context["history"][-10:]

    def decide(self, decision: str, rationale: str):
        self.context["decisions"].append({"decision": decision, "rationale": rationale, "ts": datetime.now().isoformat()})
        self._save()

    def summary(self) -> str:
        history = len(self.context["history"])
        decisions = len(self.context["decisions"])
        recent = [h["key"] for h in self.context["history"][-5:]]
        return f"Client: {self.client} | Project: {self.project} | {history} facts | {decisions} decisions | Recent: {recent}"

    def _save(self):
        SESSIONS_DIR.mkdir(exist_ok=True)
        session_file = SESSIONS_DIR / f"{self.session_id}.json"
        session_file.write_text(json.dumps(self.context, indent=2, default=str))


# ── Test ───────────────────────────────────────────────
if __name__ == "__main__":
    s = ClientSession("Acme Corp", "supply-chain-ai")
    s.remember("industry", "Logistics")
    s.remember("budget", "500K AED")
    s.remember("timeline", "3 months")
    s.decide("Use DeepSeek V4", "Best cost/performance for Arabic")
    print(s.summary())
    print(f"\nRecall 'budget': {s.recall('budget')}")
    print("✅ Client session memory ready")
