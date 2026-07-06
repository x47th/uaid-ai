#!/usr/bin/env python
"""Health Alert Script — run via cron, alerts on service failures."""
import urllib.request, json, sys, os
from datetime import datetime

SERVICES = {
    "Neo4j": "http://localhost:7474",
    "Qdrant": "http://localhost:6333/collections",
    "Horizon API": "http://localhost:3000/health",
    "GraphRAG API": "http://localhost:3001/graphrag/stats",
    "UAID Dashboard": "http://localhost:8000",
    "Open WebUI": "http://localhost:8080",
}

failures = []
for name, url in SERVICES.items():
    try:
        r = urllib.request.urlopen(url, timeout=5)
        if r.status >= 500:
            failures.append(f"{name}: HTTP {r.status}")
    except Exception as e:
        failures.append(f"{name}: {str(e)[:50]}")

if failures:
    msg = f"⚠️ UAID ALERT [{datetime.now().strftime('%H:%M')}]\n" + "\n".join(f"  ❌ {f}" for f in failures)
    print(msg)
    # Write to log
    log_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(log_dir, "alert_log.txt"), "a") as f:
        f.write(msg + "\n")
    sys.exit(1)
else:
    print(f"✅ All {len(SERVICES)} services healthy [{datetime.now().strftime('%H:%M')}]")
