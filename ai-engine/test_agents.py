"""
UAID AI Agent Tests — Built by Builder Agent, validated by Validator Agent
Tests client_session, cost_tracker, prompt_registry, embeddings modules.
"""
import pytest
import os, sys, json, tempfile, shutil
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add uaid_agents to path
sys.path.insert(0, os.path.dirname(__file__))

# ── MOCKS ──────────────────────────────────────────────

@pytest.fixture
def mock_neo4j():
    with patch('neo4j.GraphDatabase.driver') as mock_driver:
        driver = MagicMock()
        session = MagicMock()
        # Simulate session context manager: with driver.session() as s: ...
        driver.session.return_value = session
        session.__enter__.return_value = session
        session.__exit__.return_value = None
        # Simulate .run().single() returning None (no existing client)
        result = MagicMock()
        result.single.return_value = None
        session.run.return_value = result
        mock_driver.return_value = driver
        yield driver, session

@pytest.fixture
def mock_qdrant():
    with patch('qdrant_client.QdrantClient') as mock:
        client = MagicMock()
        mock.return_value = client
        yield client

@pytest.fixture
def mock_deepseek():
    with patch('openai.OpenAI') as mock:
        client = MagicMock()
        mock.return_value = client
        yield client

@pytest.fixture
def temp_session_dir():
    tmp = tempfile.mkdtemp()
    with patch('client_session.SESSIONS_DIR', Path(tmp)):
        yield tmp
    shutil.rmtree(tmp, ignore_errors=True)

# ── CLIENT SESSION TESTS ───────────────────────────────

class TestClientSession:
    def test_create_session(self, mock_neo4j, temp_session_dir):
        from client_session import ClientSession
        s = ClientSession("TestCorp", "test-project")
        assert s.client == "TestCorp"
        assert s.project == "test-project"
        assert len(s.context['history']) == 0

    def test_remember_and_recall(self, mock_neo4j, temp_session_dir):
        from client_session import ClientSession
        s = ClientSession("TestCorp")
        s.remember("budget", "500K AED")
        s.remember("timeline", "3 months")
        recalled = s.recall("budget")
        assert len(recalled) == 1
        assert recalled[0]['value'] == "500K AED"

    def test_recall_returns_recent(self, mock_neo4j, temp_session_dir):
        from client_session import ClientSession
        s = ClientSession("TestCorp")
        for i in range(15):
            s.remember(f"fact_{i}", i)
        assert len(s.recall()) == 10  # returns last 10

    def test_decisions(self, mock_neo4j, temp_session_dir):
        from client_session import ClientSession
        s = ClientSession("TestCorp")
        s.decide("Use DeepSeek", "Best cost/performance")
        assert len(s.context['decisions']) == 1
        assert s.context['decisions'][0]['decision'] == "Use DeepSeek"

    def test_summary(self, mock_neo4j, temp_session_dir):
        from client_session import ClientSession
        s = ClientSession("TestCorp", "ai-project")
        s.remember("budget", "1M AED")
        summary = s.summary()
        assert "TestCorp" in summary
        assert "1 facts" in summary


# ── COST TRACKER TESTS ─────────────────────────────────

class TestCostTracker:
    def test_track_call(self):
        from cost_tracker import CostTracker
        ct = CostTracker("test-client")
        ct.track("deepseek-v4-pro", "Hello" * 100, "World" * 200)
        assert len(ct.calls) == 1
        assert ct.calls[0]['model'] == "deepseek-v4-pro"

    def test_summary(self):
        from cost_tracker import CostTracker
        ct = CostTracker("test-client")
        ct.track("deepseek-v4-flash", "A" * 100, "B" * 200)
        s = ct.summary()
        assert s['calls'] == 1
        assert s['client'] == "test-client"
        assert s['cost'] >= 0  # can be 0 with very small inputs

    def test_pricing_applied(self):
        from cost_tracker import CostTracker, PRICING
        ct = CostTracker("test")
        ct.track("deepseek-v4-pro", "X" * 100, "Y" * 100)
        # Pro is more expensive than Flash
        ct2 = CostTracker("test2")
        ct2.track("deepseek-v4-flash", "X" * 100, "Y" * 100)
        assert ct.summary()['cost'] > ct2.summary()['cost']


# ── PROMPT REGISTRY TESTS ──────────────────────────────

class TestPromptRegistry:
    def test_get_default(self, tmp_path):
        from prompt_registry import PromptRegistry
        with patch('prompt_registry.PROMPTS_DIR', tmp_path):
            pr = PromptRegistry()
            ceo = pr.get("ceo")
            assert "CEO" in ceo or "UAID" in ceo

    def test_update_and_version(self, tmp_path):
        from prompt_registry import PromptRegistry
        with patch('prompt_registry.PROMPTS_DIR', tmp_path):
            pr = PromptRegistry()
            v = pr.update("researcher", "Enhanced prompt v2")
            assert v == 2
            assert pr.latest("researcher") == 2
            assert "Enhanced" in pr.get("researcher", 2)

    def test_rollback(self, tmp_path):
        from prompt_registry import PromptRegistry
        with patch('prompt_registry.PROMPTS_DIR', tmp_path):
            pr = PromptRegistry()
            pr.update("ceo", "New CEO prompt v2")
            # Rollback to v1
            v1 = pr.get("ceo", 1)
            assert "CEO" in v1

    def test_list_versions(self, tmp_path):
        from prompt_registry import PromptRegistry
        with patch('prompt_registry.PROMPTS_DIR', tmp_path):
            pr = PromptRegistry()
            pr.update("builder", "v2")
            pr.update("builder", "v3")
            versions = pr.list_versions("builder")
            assert versions == [1, 2, 3]


# ── EMBEDDINGS TESTS ───────────────────────────────────

class TestEmbeddings:
    def test_embed_returns_384d_vector(self):
        from embeddings import embed
        vec = embed("Supply chain automation in UAE")
        assert len(vec) == 384
        assert all(isinstance(v, float) for v in vec)

    def test_embed_diff_texts_diff_vectors(self):
        from embeddings import embed
        v1 = embed("AI for banking")
        v2 = embed("Football scores")
        # Vectors should be different (not identical)
        assert v1 != v2

    def test_embed_batch(self):
        from embeddings import embed_batch
        vecs = embed_batch(["text one", "text two", "text three"])
        assert len(vecs) == 3
        assert all(len(v) == 384 for v in vecs)

    def test_model_is_singleton(self):
        from embeddings import get_model
        m1 = get_model()
        m2 = get_model()
        assert m1 is m2  # same instance


# ── RUN ─────────────────────────────────────────────────
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
