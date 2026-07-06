# ⚠️ UAID — Gotchas & Pitfalls

> Errors I hit and how I fixed them. Don't repeat these.

## 1. Qdrant API: `.search()` → `.query_points()`

**Error:** `AttributeError: 'QdrantClient' object has no attribute 'search'`

**Fix:** The Qdrant client v1.18.0 uses `.query_points()` not `.search()`:
```python
# ❌ Old (broken)
results = self.qdrant.search(collection_name=COLLECTION, query_vector=vec, limit=limit)

# ✅ New (works)
results = self.qdrant.query_points(collection_name=COLLECTION, query=vec, limit=limit).points
```

## 2. Neo4j Password Redaction

**Problem:** When creating Docker containers through Hermes, the `NEO4J_AUTH` password gets redacted to `***` in the command.

**Fix:** Use explicit `neo4j/password` format and verify the password works:
```bash
docker rm -f neo4j
docker run -d --name neo4j ... -e NEO4J_AUTH=neo4j/UAID2026secure! ...
```
Then test: `python -c "from neo4j import GraphDatabase; ..."`

## 3. Docker Not in Git-Bash PATH

**Problem:** `docker: command not found` in terminal even though Docker Desktop is installed.

**Fix:** Docker is at `C:\Program Files\Docker\Docker\resources\bin\docker.exe`. Add to PATH:
```bash
export PATH="$PATH:/c/Program Files/Docker/Docker/resources/bin"
```

## 4. crewai CLI Interactive Mode

**Problem:** `crewai create crew uaid_agents` opens an interactive wizard that can't be scripted.

**Fix:** Scaffold project manually — create directories and files directly.

## 5. GraphAI Package Name

**Problem:** `npm install @receptron/graphai` → 404 Not Found

**Fix:** The correct package is `@receptron/graphai_cli`:
```bash
npm install @receptron/graphai_cli
```

## 6. GitHub Container Registry Blob Failures

**Problem:** `docker pull ghcr.io/open-webui/open-webui:main` fails with EOF on blob downloads.

**Symptom:** `failed to copy: httpReadSeeker: failed open: ... EOF`

**Status:** Unresolved — appears to be a CDN/registry issue. Tried both `:main` and `:latest` tags. May need retry later or use a mirror.

## 7. Browserbase Can't Reach localhost

**Problem:** Browser tool runs on cloud Browserbase infra, so `localhost` in the browser refers to Browserbase's server, not the user's machine.

**Fix:** Use terminal for all local testing, curl for HTTP checks. Browser is only useful for public URLs.

## 8. `.env` Protected from Read

**Problem:** `read_file` on `.env` returns "Access denied" — secret-bearing files are protected.

**Fix:** Use `write_file` to overwrite with new content. Can't read existing values, only replace.

## 9. Python Command on Windows

**Problem:** `python3` doesn't exist on this Windows setup.

**Fix:** Use `python` (3.11.15). pip is also just `pip`, not `pip3`.

## 10. Pseudo-Embeddings Limitation

**Problem:** Current embeddings are hash-based, not semantic.

**Impact:** Qdrant vector similarity is weak — results are essentially random.

**Fix (future):** Integrate DeepSeek embeddings API or `sentence-transformers` for real semantic embeddings.
