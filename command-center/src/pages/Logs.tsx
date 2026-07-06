import { useState, useEffect } from 'react';

const dummyLogs = [
  '[12:00:01] ✅ Neo4j: Connected — 32 nodes', '[12:00:02] ✅ Qdrant: Collection ready — 23 vectors',
  '[12:00:03] ✅ Horizon API: Started on :3000', '[12:00:04] ✅ GraphRAG: Started on :3001',
  '[12:01:15] 📨 POST /graphrag/query — 200 OK (1.2s)', '[12:02:30] 📨 GET /companies?take=10 — 200 OK (45ms)',
  '[12:05:00] 🧠 Daily optimization complete', '[12:10:00] 🔄 Brain sync: 23 notes → Neo4j',
];

export default function Logs() {
  const [logs, setLogs] = useState(dummyLogs);

  useEffect(() => {
    const i = setInterval(() => {
      setLogs(l => [...l.slice(-50), `[${new Date().toLocaleTimeString()}] 📨 Activity detected`]);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Logs</h1>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Real-time system logs</p>
      <div className="rounded-lg border p-4 font-mono text-xs leading-relaxed h-[calc(100vh-180px)] overflow-auto" style={{ background: '#0a0a0f', borderColor: 'var(--border)' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: l.includes('✅') ? 'var(--green)' : l.includes('📨') ? 'var(--accent)' : 'var(--text-muted)' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}