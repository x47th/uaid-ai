"""
Shared embedding model — single instance for all UAID components.
Import from graphrag.py, brain_sync.py, dspy_pipeline.py.
"""
_model = None

def get_model():
    """Returns cached sentence-transformers model (384-dim)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    return _model

def embed(text: str) -> list[float]:
    """Embed text to 384-dim vector using shared model."""
    model = get_model()
    return model.encode(text[:2000]).tolist()

def embed_batch(texts: list[str]) -> list[list[float]]:
    """Embed multiple texts at once (faster)."""
    model = get_model()
    return model.encode([t[:2000] for t in texts]).tolist()
