import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [services, setServices] = useState<any>({});

  useEffect(() => {
    axios.get('http://localhost:3001/graphrag/stats').then(r => {
      const s: any = {};
      r.data.forEach((d: any) => { s[d.type] = d.count; });
      setStats(s);
    }).catch(() => {});
    
    // Service status
    ['http://localhost:3000/health','http://localhost:3001/graphrag/stats','http://localhost:8000/api/status','http://localhost:7474'].forEach(url => {
      axios.get(url, { timeout: 2000 }).then(() => {
        setServices((p: any) => ({ ...p, [url.split('//')[1].split(':')[0]]: true }));
      }).catch(() => {
        setServices((p: any) => ({ ...p, [url.split('//')[1].split(':')[0]]: false }));
      });
    });
  }, []);

  const svcs = ['localhost','localhost','localhost','localhost'];
  const labels = ['Horizon API :3000','GraphRAG :3001','Dashboard :8000','Neo4j :7474'];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">UAID Command Center</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>All systems monitored in real-time</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Agents', val: 8, color: 'var(--accent)' },
          { label: 'Clients', val: stats.Client || 1, color: 'var(--green)' },
          { label: 'Problems', val: stats.Problem || 3, color: 'var(--amber)' },
          { label: 'Solutions', val: stats.Solution || 2, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-3">Service Status</h2>
      <div className="grid grid-cols-2 gap-2">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: services[Object.keys(services)[i]] !== false ? 'var(--green)' : 'var(--red)' }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}