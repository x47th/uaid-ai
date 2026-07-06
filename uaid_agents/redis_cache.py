"""Redis Cache — Simple in-memory cache with TTL for API responses."""
import time, hashlib, json
from functools import wraps

_cache: dict = {}
_stats = {"hits": 0, "misses": 0, "entries": 0}

def cached(ttl: int = 300):
    """Decorator: cache function results for TTL seconds."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = hashlib.md5((fn.__name__ + str(args) + str(kwargs)).encode()).hexdigest()
            now = time.time()
            if key in _cache and _cache[key]["expires"] > now:
                _stats["hits"] += 1
                return _cache[key]["data"]
            _stats["misses"] += 1
            result = fn(*args, **kwargs)
            _cache[key] = {"data": result, "expires": now + ttl}
            _stats["entries"] = len(_cache)
            return result
        return wrapper
    return decorator

def cache_stats() -> dict:
    return _stats

def cache_clear():
    _cache.clear()
    _stats.update({"hits": 0, "misses": 0, "entries": 0})
    return {"cleared": True}