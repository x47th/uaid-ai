export default function Services() {
  const svcs = [
    { name: 'Neo4j Graph Database', port: 7474, desc: 'Knowledge graph — 32 nodes, 4 types' },
    { name: 'Qdrant Vector Engine', port: 6333, desc: 'Semantic search — 23 vectors, 384-dim' },
    { name: 'Horizon CRM API', port: 3000, desc: 'REST backend — JWT, multi-tenant' },
    { name: 'GraphRAG Engine', port: 3001, desc: 'Hybrid RAG — Neo4j + Qdrant + DeepSeek' },
    { name: 'UAID Dashboard', port: 8000, desc: 'FastAPI — graph viz + system status' },
    { name: 'Horizon Frontend', port: 5173, desc: 'React CRM — dark theme, shadcn' },
    { name: 'Command Center', port: 5000, desc: 'This application — unified control' },
  ];
  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <h1 className="text-[22px] font-bold tracking-tight mb-1">Services</h1>
      <p className="text-[13px] mb-8" style={{ color: 'var(--color-text-secondary)' }}>Infrastructure health and control</p>
      <div className="space-y-2">
        {svcs.map(s => (
          <div key={s.port} className="flex items-center justify-between rounded-xl border px-5 py-4 transition-colors hover:border-opacity-50"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-4">
              <div className="relative"><div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-green)' }} /></div>
              <div>
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono px-2 py-1 rounded-md" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>:{s.port}</span>
              <span className="text-[11px] font-medium px-2 py-1 rounded-md" style={{ background: '#16a34a12', color: 'var(--color-green)' }}>Live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}