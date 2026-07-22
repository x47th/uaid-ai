"""
Memory Galaxy — Obsidian vault reader for agent context.
Every agent call pre-loads relevant vault knowledge to avoid re-explaining.
"""
import os, glob
from pathlib import Path

VAULT = Path(__file__).parent.parent / "big lab"

def load_context(problem: str, max_files: int = 5) -> str:
    """Pre-load relevant vault context before an agent call. Saves ~20% tokens per prompt."""
    if not VAULT.exists():
        return ""
    
    notes = glob.glob(str(VAULT / "*.md"))
    context_parts = []
    
    # Always include core files
    core = ["UAID - Knowledge Hub", "UAID - System Architecture", "UAID - What Works", "UAID - Gotchas"]
    for name in core:
        path = VAULT / f"{name}.md"
        if path.exists():
            context_parts.append(path.read_text(encoding="utf-8")[:500])
    
    # Search for problem-specific notes (simple keyword match)
    keywords = set(problem.lower().split()) & {
        "ai", "data", "api", "graph", "query", "agent", "search",
        "automation", "analytics", "fraud", "banking", "uae",
        "supply", "chain", "customer", "crm", "security", "ml"
    }
    
    for note in notes[:max_files]:
        name = os.path.basename(note).replace(".md", "")
        if any(k in name.lower() for k in keywords) or name in core:
            try:
                content = open(note, encoding="utf-8").read()[:800]
                if content and name not in core:
                    context_parts.append(content)
            except: pass
    
    context = "\n\n---\n\n".join(context_parts[:max_files * 2])
    return context[:3000]  # Token budget safe

def get_knowledge_stats() -> dict:
    """Return vault statistics for Agent OS display."""
    if not VAULT.exists():
        return {"notes": 0, "size_kb": 0}
    
    notes = glob.glob(str(VAULT / "*.md"))
    size = sum(os.path.getsize(n) for n in notes) // 1024
    return {
        "notes": len(notes),
        "size_kb": size,
        "last_updated": max(os.path.getmtime(n) for n in notes) if notes else 0
    }

if __name__ == "__main__":
    stats = get_knowledge_stats()
    print(f"📚 Knowledge Vault: {stats['notes']} notes, {stats['size_kb']}KB")
    ctx = load_context("fraud detection AI")
    print(f"🧠 Context loaded: {len(ctx)} chars")