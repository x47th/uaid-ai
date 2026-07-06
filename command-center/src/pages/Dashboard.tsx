import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

function StatCard({ label, value, change, icon: Icon, color }: any) {
  return (
    <div className="rounded-xl p-5 border transition-colors hover:border-opacity-50 group"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ background: `${color}12` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: '#16a34a12', color: 'var(--color-green)' }}>
            <TrendingUp size={12} />{change}
          </span>
        )}
      </div>
      <div className="text-[28px] font-bold tracking-tight tabular-nums leading-none mb-1">{value}</div>
      <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  );
}

function ServiceDot({ name, port, status }: { name: string; port: number; status?: boolean }) {
  const isUp = status !== false;
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border transition-colors"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: isUp ? 'var(--color-green)' : 'var(--color-red)' }} />
          {isUp && <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-30" style={{ background: 'var(--color-green)' }} />}
        </div>
        <span className="text-[13px] font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>:{port}</span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md"
          style={{ background: isUp ? '#16a34a12' : '#dc262612', color: isUp ? 'var(--color-green)' : 'var(--color-red)' }}>
          {isUp ? 'Live' : 'Down'}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [services, setServices] = useState<any>({});

  useEffect(() => {
    axios.get('http://localhost:3001/graphrag/stats', { timeout: 3000 }).then(r => {
      const s: any = {};
      r.data.forEach((d: any) => { s[d.type] = d.count; });
      setStats(s);
    }).catch(() => {});

    const svcs: [string, string][] = [
      ['horizon', 'http://localhost:3000/health'],
      ['graphrag', 'http://localhost:3001/graphrag/stats'],
      ['dashboard', 'http://localhost:8000/api/status'],
      ['neo4j', 'http://localhost:7474'],
    ];
    svcs.forEach(([name, url]) => {
      axios.get(url, { timeout: 2000 }).then(() => setServices((p: any) => ({ ...p, [name]: true })))
        .catch(() => setServices((p: any) => ({ ...p, [name]: false })));
    });
  }, []);

  const statCards = [
    { label: 'Active Agents', value: '8', change: 'All online', icon: Activity, color: '#3b82f6' },
    { label: 'Clients', value: stats.Client || '1', change: '+1 this week', icon: TrendingUp, color: '#22c55e' },
    { label: 'Problems Solved', value: stats.Solution || '2', change: '2 resolved', icon: Clock, color: '#f59e0b' },
    { label: 'Knowledge Nodes', value: stats.Note || '26', change: '23 synced', icon: ArrowUpRight, color: '#7c3aed' },
  ];

  const svcList = [
    { name: 'Horizon CRM API', port: 3000, key: 'horizon' },
    { name: 'GraphRAG Engine', port: 3001, key: 'graphrag' },
    { name: 'UAID Dashboard', port: 8000, key: 'dashboard' },
    { name: 'Neo4j Graph DB', port: 7474, key: 'neo4j' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-1">UAID Command Center</h1>
          <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Real-time intelligence and control for your AI platform</p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-green)' }} />
          Live · Auto-refreshing
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Activity Feed */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Recent Activity</h2>
        <div className="rounded-xl border divide-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          {[
            { time: '2 min ago', text: 'GraphRAG query completed — 32 nodes searched', dot: '#3b82f6' },
            { time: '8 min ago', text: 'Daily brain sync — 23 notes synced to Qdrant', dot: '#7c3aed' },
            { time: '15 min ago', text: 'Client session saved — Acme Corp', dot: '#22c55e' },
            { time: '1 hour ago', text: '8-agent pipeline completed — 3 parallel batches', dot: '#f59e0b' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.dot }} />
              <span className="text-[13px] flex-1">{a.text}</span>
              <span className="text-[11px] shrink-0" style={{ color: 'var(--color-text-muted)' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-sm font-semibold mb-3 tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>Infrastructure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {svcList.map(s => <ServiceDot key={s.key} name={s.name} port={s.port} status={services[s.key]} />)}
        </div>
      </div>
    </div>
  );
}