"""
UAID Self-Observer + Health Monitor
Learns from every action, monitors all services, auto-alerts on failure.
"""
import json, time, requests
from datetime import datetime
from pathlib import Path

HISTORY_FILE = Path(__file__).parent / "action_history.json"

class SelfObserver:
    """Logs every action, reflects on patterns, generates improvement lessons."""

    def __init__(self):
        self.history = self._load()

    def _load(self):
        if HISTORY_FILE.exists():
            return json.loads(HISTORY_FILE.read_text())
        return {"actions": [], "lessons": [], "stats": {"total": 0, "successes": 0, "failures": 0}}

    def _save(self):
        HISTORY_FILE.write_text(json.dumps(self.history, indent=2, default=str))

    def log(self, action: str, result: str, success: bool, duration_ms: float = 0):
        entry = {
            "action": action,
            "result": result[:500],
            "success": success,
            "duration_ms": duration_ms,
            "timestamp": datetime.now().isoformat(),
        }
        self.history["actions"].append(entry)
        self.history["stats"]["total"] += 1
        if success:
            self.history["stats"]["successes"] += 1
        else:
            self.history["stats"]["failures"] += 1
        self._save()

    def reflect(self) -> dict:
        """Analyze recent actions and generate lessons."""
        recent = self.history["actions"][-20:]
        failures = [a for a in recent if not a["success"]]
        successes = [a for a in recent if a["success"]]

        lessons = []
        if failures:
            lessons.append(f"⚠️ {len(failures)} recent failures — review: {failures[-1]['action']}")
        if successes and len(successes) > len(failures):
            lessons.append(f"✅ Success rate: {len(successes)}/{len(recent)} — patterns are working")

        self.history["lessons"].extend(lessons)
        self._save()
        return {"failures": len(failures), "successes": len(successes), "lessons": lessons}

    def stats(self) -> dict:
        return self.history["stats"]


class HealthMonitor:
    """Pings all services, returns status, can trigger alerts."""

    SERVICES = {
        "neo4j": "http://localhost:7474",
        "qdrant": "http://localhost:6333/collections",
        "horizon_api": "http://localhost:3000/health",
        "uaid_dashboard": "http://localhost:8000/api/status",
        "open_webui": "http://localhost:8080",
    }

    def check_all(self) -> dict:
        results = {}
        for name, url in self.SERVICES.items():
            try:
                r = requests.get(url, timeout=3)
                results[name] = {"up": r.status_code < 500, "code": r.status_code, "latency_ms": r.elapsed.total_seconds() * 1000}
            except Exception as e:
                results[name] = {"up": False, "error": str(e)[:100]}
        return results

    def is_healthy(self) -> bool:
        return all(s.get("up", False) for s in self.check_all().values())


# ── Run ───────────────────────────────────────────────
if __name__ == "__main__":
    observer = SelfObserver()
    monitor = HealthMonitor()

    print("🩺 HEALTH CHECK")
    print("=" * 40)
    status = monitor.check_all()
    for name, s in status.items():
        icon = "✅" if s.get("up") else "❌"
        detail = f"HTTP {s.get('code')}" if s.get("up") else s.get("error", "down")
        print(f"  {icon} {name}: {detail}")

    healthy = monitor.is_healthy()
    observer.log("health_check", json.dumps(status), healthy)

    print(f"\n📊 SELF-OBSERVER STATS")
    print("=" * 40)
    stats = observer.stats()
    print(f"  Total actions: {stats['total']}")
    print(f"  Successes: {stats['successes']}")
    print(f"  Failures: {stats['failures']}")

    lessons = observer.reflect()
    if lessons["lessons"]:
        print(f"\n💡 Recent lessons:")
        for l in lessons["lessons"]:
            print(f"  {l}")

    print(f"\n{'✅ All systems healthy' if healthy else '❌ Some services down!'}")
