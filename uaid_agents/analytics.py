"""
Usage Analytics Dashboard — Track which features are used, how often, and by whom.
"""
import json, os
from pathlib import Path
from datetime import datetime, timedelta
from neo4j import GraphDatabase

ANALYTICS_FILE = Path(__file__).parent / "analytics.json"
NEO4J = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", os.getenv("NEO4J_PASSWORD", "UAID2026secure!")))

class Analytics:
    def __init__(self):
        self.data = self._load()

    def _load(self):
        if ANALYTICS_FILE.exists():
            return json.loads(ANALYTICS_FILE.read_text())
        return {"events": [], "daily": {}, "features": {}}

    def _save(self):
        ANALYTICS_FILE.write_text(json.dumps(self.data, indent=2, default=str))

    def track(self, event: str, feature: str = "general", metadata: dict = None):
        entry = {"event": event, "feature": feature, "ts": datetime.now().isoformat(), "meta": metadata or {}}
        self.data["events"].append(entry)

        # Daily rollup
        day = datetime.now().strftime("%Y-%m-%d")
        self.data["daily"].setdefault(day, {"total": 0, "features": {}})
        self.data["daily"][day]["total"] += 1
        self.data["daily"][day]["features"].setdefault(feature, 0)
        self.data["daily"][day]["features"][feature] += 1

        # Feature rollup
        self.data["features"].setdefault(feature, 0)
        self.data["features"][feature] += 1

        self._save()

    def dashboard(self) -> dict:
        today = datetime.now().strftime("%Y-%m-%d")
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

        # Also check Neo4j for graph stats
        neo4j_nodes = 0
        try:
            with NEO4J.session() as s:
                neo4j_nodes = s.run("MATCH (n) RETURN count(n) as c").single()["c"]
        except:
            pass

        return {
            "today": self.data["daily"].get(today, {"total": 0}),
            "yesterday": self.data["daily"].get(yesterday, {"total": 0}),
            "total_events": len(self.data["events"]),
            "top_features": sorted(self.data["features"].items(), key=lambda x: x[1], reverse=True)[:5],
            "neo4j_nodes": neo4j_nodes,
        }


# ── Test ───────────────────────────────────────────────
if __name__ == "__main__":
    a = Analytics()
    a.track("query", "graphrag", {"tokens": 1200})
    a.track("build", "complete_team", {"agents": 8})
    a.track("enrich", "horizon_crm", {"company": "Stripe"})
    a.track("query", "graphrag", {"tokens": 800})

    dash = a.dashboard()
    print("📊 Analytics Dashboard:")
    print(f"   Today: {dash['today']['total']} events")
    print(f"   Total: {dash['total_events']} events")
    print(f"   Neo4j: {dash['neo4j_nodes']} nodes")
    print(f"   Top features: {dash['top_features']}")
    print("✅ Analytics ready")
