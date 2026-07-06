const services = [
  { name: 'Neo4j Graph', port: 7474, desc: 'Knowledge graph database' },
  { name: 'Qdrant Vector', port: 6333, desc: 'Semantic search engine' },
  { name: 'Horizon API', port: 3000, desc: 'CRM backend' },
  { name: 'GraphRAG API', port: 3001, desc: 'AI reasoning engine' },
  { name: 'UAID Dashboard', port: 8000, desc: 'Web dashboard' },
  { name: 'Horizon Frontend', port: 5173, desc: 'CRM UI' },
  { name: 'Command Center', port: 5175, desc: 'This application' },
];

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Services</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Monitor and control all services</p>
      <div className="space-y-2">
        {services.map(s => (
          <div key={s.port} className="flex items-center justify-between rounded-lg border px-4 py-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green)' }} />
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc} — :{s.port}</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              {['Restart','Stop','Logs'].map(a => (
                <button key={a} className="text-xs px-2.5 py-1 rounded-md border transition" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{a}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}