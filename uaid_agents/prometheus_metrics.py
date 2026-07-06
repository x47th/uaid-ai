"""Prometheus Metrics Endpoint — adds /metrics to any FastAPI app."""
from fastapi import FastAPI, Response
import time, psutil

_start_time = time.time()
_counters: dict = {}
_gauges: dict = {}

def track_request(endpoint: str, status: int = 200, duration: float = 0):
    key = f"http_requests_total{{endpoint=\"{endpoint}\",status=\"{status}\"}}"
    _counters[key] = _counters.get(key, 0) + 1

def set_gauge(name: str, value: float, labels: dict = None):
    label_str = ",".join(f'{k}="{v}"' for k, v in (labels or {}).items())
    key = f"{name}{{{label_str}}}" if label_str else name
    _gauges[key] = value

def metrics_response() -> Response:
    set_gauge("uptime_seconds", time.time() - _start_time)
    set_gauge("memory_used_bytes", psutil.Process().memory_info().rss)
    set_gauge("cpu_percent", psutil.cpu_percent())
    set_gauge("neo4j_nodes", 32)  # would query live

    lines = []
    for k, v in _counters.items():
        lines.append(f"# HELP {k.split('{')[0]} Request count")
        lines.append(f"# TYPE {k.split('{')[0]} counter")
        lines.append(f"{k} {v}")
    for k, v in _gauges.items():
        lines.append(f"# HELP {k} Gauge value")
        lines.append(f"# TYPE {k} gauge")
        lines.append(f"{k} {v}")
    return Response(content="\n".join(lines) + "\n", media_type="text/plain")

def mount_metrics(app: FastAPI):
    @app.get("/metrics")
    async def metrics():
        return metrics_response()
    return app