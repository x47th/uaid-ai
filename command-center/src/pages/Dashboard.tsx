import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, Clock, ArrowUpRight, Sparkles, Zap, Brain, Server } from 'lucide-react';

function StatCard({ label, value, change, icon: Icon, color, glow }: any) {
  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 hover-lift glass animate-in ${glow}`}
      style={{ borderColor: 'var(--color-border)', animationDelay: '0.1s' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12` }}>
          <Icon size={22} style={{ color }} />
        </div>
        {change && (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: '#16a34a12', color: 'var(--color-green)' }}>
            <TrendingUp size={12} />{change}
          </span>
        )}
      </div>
      <div className="text-[30px] font-bold tracking-tight tabular-nums mb-1">{value}</div>
      <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
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
      ['horizon', 'http://localhost:3000/health'], ['graphrag', 'http://localhost:3001/graphrag/stats'],
      ['dashboard', 'http://localhost:8000/api/status'], ['neo4j', 'http://localhost:7474'],
    ];
    svcs.forEach(([name, url]) => {
      axios.get(url, { timeout: 2000 }).then(() => setServices((p: any) => ({ ...p, [name]: true })))
        .catch(() => setServices((p: any) => ({ ...p, [name]: false })));
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-10 animate-in">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight mb-1">
            <span className="text-gradient">UAID Command Center</span>
          </h1>
          <p className="text-[13px] flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <Sparkles size={14} style={{ color: 'var(--color-purple)' }} />
            Real-time intelligence for your AI platform
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs px-4 py-2 rounded-xl glass" style={{ borderColor: 'var(--color-green-glow)' }}>
          <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--color-green)' }} />
          <span style={{ color: 'var(--color-green)' }}>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active Agents" value="8" change="All online" icon={Brain} color="#3b82f6" glow="glow-blue" />
        <StatCard label="Clients" value={stats.Client || '1'} change="+1 this week" icon={TrendingUp} color="#22c55e" glow="glow-green" />
        <StatCard label="Problems Solved" value={stats.Solution || '2'} change="2 resolved" icon={Clock} color="#f59e0b" glow="" />
        <StatCard label="Knowledge Nodes" value={stats.Note || '26'} change="23 synced" icon={Zap} color="#8b5cf6" glow="glow-purple" />
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
          <Activity size={14} /> RECENT ACTIVITY
        </h2>
        <div className="rounded-2xl glass divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { time: '2 min ago', text: 'GraphRAG query completed — 32 nodes searched', dot: '#3b82f6', icon: '🔍' },
            { time: '8 min ago', text: 'Daily brain sync — 23 notes synced to Qdrant', dot: '#8b5cf6', icon: '🧠' },
            { time: '15 min ago', text: 'Client session saved — Acme Corp', dot: '#22c55e', icon: '👤' },
            { time: '1 hour ago', text: '8-agent pipeline completed — 3 parallel batches', dot: '#f59e0b', icon: '🤖' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
              <span className="text-lg">{a.icon}</span>
              <span className="text-[13px] flex-1">{a.text}</span>
              <span className="text-[11px] shrink-0 px-2 py-1 rounded-lg"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
          <Server size={14} /> INFRASTRUCTURE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: 'Horizon CRM API', port: 3000, key: 'horizon' },
            { name: 'GraphRAG Engine', port: 3001, key: 'graphrag' },
            { name: 'UAID Dashboard', port: 8000, key: 'dashboard' },
            { name: 'Neo4j Graph DB', port: 7474, key: 'neo4j' },
          ].map(s => {
            const up = services[s.key] !== false;
            return (
              <div key={s.key} className="flex items-center justify-between px-4 py-3 rounded-xl glass transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: up ? 'var(--color-green)' : 'var(--color-red)' }} />
                    {up && <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-20" style={{ background: 'var(--color-green)' }} />}
                  </div>
                  <span className="text-[13px] font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-1 rounded-lg" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>:{s.port}</span>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-lg"
                    style={{ background: up ? 'var(--color-green-glow)' : 'rgba(239,68,68,0.1)', color: up ? 'var(--color-green)' : 'var(--color-red)' }}>
                    {up ? 'Live' : 'Down'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}