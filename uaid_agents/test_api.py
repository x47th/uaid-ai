"""
UAID API Integration Tests — Test all live endpoints.
"""
import pytest, urllib.request, json, os, sys

BASE_URLS = {
    "horizon": "http://localhost:3000",
    "graphrag": "http://localhost:3001",
    "dashboard": "http://localhost:8000",
}

def get(service, path="/"):
    return urllib.request.urlopen(f"{BASE_URLS[service]}{path}", timeout=5)

def post(service, path, data):
    req = urllib.request.Request(f"{BASE_URLS[service]}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"})
    return urllib.request.urlopen(req, timeout=5)

class TestHorizonAPI:
    def test_health(self):
        r = get("horizon", "/health")
        d = json.loads(r.read())
        assert d["status"] == "ok"

    def test_login(self):
        r = post("horizon", "/auth/login", {"email": "test@horizon.com", "password": "test123"})
        d = json.loads(r.read())
        assert "access_token" in d
        assert "tenantId" in d

    def test_companies_pagination(self):
        token = json.loads(post("horizon", "/auth/login",
            {"email": "test@horizon.com", "password": "test123"}).read())["access_token"]
        req = urllib.request.Request("http://localhost:3000/companies?take=2&skip=0",
            headers={"Authorization": f"Bearer {token}"})
        r = urllib.request.urlopen(req, timeout=5)
        d = json.loads(r.read())
        assert isinstance(d, list)
        assert len(d) <= 2

class TestGraphRAGAPI:
    def test_stats(self):
        r = get("graphrag", "/graphrag/stats")
        d = json.loads(r.read())
        assert isinstance(d, list)
        assert len(d) >= 3  # Client, Problem, Solution, Note

    def test_graph_search(self):
        r = urllib.request.urlopen("http://localhost:3001/graphrag/graph?q=UAID&limit=3", timeout=5)
        d = json.loads(r.read())
        assert isinstance(d, list)

    def test_semantic_search(self):
        r = urllib.request.urlopen("http://localhost:3001/graphrag/semantic?q=AI&limit=3", timeout=5)
        d = json.loads(r.read())
        assert isinstance(d, list)

class TestDashboard:
    def test_status(self):
        r = get("dashboard", "/api/status")
        d = json.loads(r.read())
        assert "deepseek" in d

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])