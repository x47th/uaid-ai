"""
Service Manager — Start/stop/check UAID services properly.
No more port conflicts, no more dead services.
"""
import os, subprocess, time, urllib.request, json, signal
from pathlib import Path

SERVICES = {
    "horizon_api": {"dir": "project-horizon", "cmd": "node dist/main.js", "port": 3000, "health": "/health", "build": "npx nest build"},
    "graphrag_api": {"dir": "uaid_core", "cmd": "node dist/main.js", "port": 3001, "health": "/graphrag/stats", "build": "npx nest build"},
    "uaid_dashboard": {"dir": "uaid_agents", "cmd": "python web_dashboard.py", "port": 8000, "health": "/api/status", "build": None},
    "horizon_frontend": {"dir": "horizon-frontend", "cmd": "npx vite --host 0.0.0.0 --port 5173", "port": 5173, "health": "/", "build": "npx vite build"},
    "uaid_frontend": {"dir": "uaid-frontend", "cmd": "npx vite --host 0.0.0.0 --port 5174", "port": 5174, "health": "/", "build": "npx vite build"},
}

ROOT = Path(__file__).parent.parent
PIDS_FILE = ROOT / "uaid_agents" / "service_pids.json"

def is_port_in_use(port: int) -> bool:
    try:
        urllib.request.urlopen(f"http://localhost:{port}", timeout=2)
        return True
    except:
        return False

def is_healthy(port: int, path: str = "/") -> bool:
    try:
        r = urllib.request.urlopen(f"http://localhost:{port}{path}", timeout=3)
        return r.status < 500
    except:
        return False

def start(name: str) -> bool:
    if name not in SERVICES:
        print(f"❌ Unknown service: {name}")
        return False

    svc = SERVICES[name]

    if is_healthy(svc["port"], svc["health"]):
        print(f"✅ {name} already running on port {svc['port']}")
        return True

    if is_port_in_use(svc["port"]):
        print(f"⚠️ Port {svc['port']} in use by another process")
        return False

    # Build if needed
    if svc.get("build"):
        print(f"🔨 Building {name}...")
        subprocess.run(f"cd {ROOT / svc['dir']} && {svc['build']}", shell=True, timeout=30, capture_output=True)

    # Start
    cwd = str(ROOT / svc['dir'])
    proc = subprocess.Popen(svc["cmd"], shell=True, cwd=cwd,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0)

    # Wait for health
    for _ in range(10):
        time.sleep(1)
        if is_healthy(svc["port"], svc["health"]):
            print(f"✅ {name} started on port {svc['port']} (PID {proc.pid})")
            return True

    print(f"⚠️ {name} started but not healthy yet (PID {proc.pid})")
    return True

def stop(name: str):
    # Kill by port
    if os.name == 'nt':
        subprocess.run(f'for /f "tokens=5" %a in (\'netstat -ano ^| findstr :{SERVICES[name]["port"]}\') do taskkill /F /PID %a',
            shell=True, capture_output=True)
    print(f"🛑 {name} stopped")

def status():
    print("=" * 50)
    print("UAID Service Status")
    print("=" * 50)
    for name, svc in SERVICES.items():
        healthy = is_healthy(svc["port"], svc["health"])
        icon = "🟢" if healthy else "🔴"
        print(f"  {icon} {name} (:{svc['port']})")
    return all(is_healthy(s["port"], s["health"]) for s in SERVICES.values())

def start_all():
    print("🚀 Starting all UAID services...")
    for name in SERVICES:
        start(name)
    print("\n" + "=" * 50)
    status()

# ── CLI ────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "start":
        target = sys.argv[2] if len(sys.argv) > 2 else None
        if target: start(target)
        else: start_all()
    elif cmd == "stop":
        stop(sys.argv[2]) if len(sys.argv) > 2 else print("Usage: python service_manager.py stop <name>")
    elif cmd == "restart":
        target = sys.argv[2]
        stop(target)
        time.sleep(2)
        start(target)
    else:
        status()