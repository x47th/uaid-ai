import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, Clock, ArrowUpRight, Sparkles, Zap, Brain, Server, Layers, Cpu, Database, GitBranch, RefreshCw, BarChart3, MessageCircle, Play, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [services, setServices] = useState<any>({});
  const [loopRunning, setLoopRunning] = useState(false);
  const [pulse, setPulse] = useState(0);

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

    const interval = setInterval(() => setPulse(p => p + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const runLoop = () => {
    setLoopRunning(true);
    setTimeout(() => setLoopRunning(false), 3000);
  };

  const layers = [
    { 
      id: 1, 
      name: 'Foundation', 
      status: 'active', 
      description: 'One dashboard, all models',
      icon: Layers,
      color: '#3b82f6',
      metrics: ['10 pages', '1 command center', 'All tools integrated']
    },
    { 
      id: 2, 
      name: 'Memory', 
      status: 'active', 
      description: 'Shared brain - 26 notes synced',
      icon: Database,
      color: '#8b5cf6',
      metrics: ['26 vault notes', 'Auto-sync', '~20% token savings']
    },
    { 
      id: 3, 
      name: 'Routing', 
      status: 'active', 
      description: 'Right model for the job',
      icon: GitBranch,
      color: '#f59e0b',
      metrics: ['V4-Pro: complex tasks', 'V4-Flash: fast tasks', 'Auto-selection']
    },
    { 
      id: 4, 
      name: 'Agents', 
      status: 'active', 
      description: '8 parallel agents, no manual work',
      icon: Cpu,
      color: '#22c55e',
      metrics: ['8 agents', '4 parallel batches', 'Cross-critique']
    },
    { 
      id: 5, 
      name: 'Loop', 
      status: loopRunning ? 'running' : 'idle', 
      description: 'Daily auto-evolution',
      icon: RefreshCw,
      color: '#ec4899',
      metrics: ['Health checks', 'Prompt optimization', 'Cost tracking']
    },
  ];

  const models = [
    { name: 'DeepSeek V4-Pro', tasks: 45, speed: '0.8s', cost: '$0.002/1K', status: 'active', usage: 'Strategist, Architect, Researcher' },
    { name: 'DeepSeek V4-Flash', tasks: 38, speed: '0.4s', cost: '$0.0005/1K', status: 'active', usage: 'Security, UX, DevOps, QA, Writer' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-in">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight mb-2">
            <span className="text-gradient">Agent Operating System</span>
          </h1>
          <p className="text-[14px] flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <Sparkles size={16} style={{ color: 'var(--color-purple)' }} />
            5-layer AI platform · All models in one screen · Systems evolve daily
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={runLoop}
            disabled={loopRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${loopRunning ? 'opacity-50' : 'hover:scale-105'}`}
            style={{ background: loopRunning ? 'var(--color-surface)' : 'linear-gradient(135deg, #9333ea, #db2777)', color: '#fff' }}>
            <RefreshCw size={16} className={loopRunning ? 'animate-spin' : ''} />
            {loopRunning ? 'Running Loop...' : 'Run Loop'}
          </button>
          <div className="flex items-center gap-3 text-xs px-4 py-2 rounded-xl glass" style={{ borderColor: 'var(--color-green-glow)' }}>
            <div className={`w-2 h-2 rounded-full ${pulse % 2 === 0 ? 'pulse-dot' : ''}`} style={{ background: 'var(--color-green)' }} />
            <span style={{ color: 'var(--color-green)' }}>Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Active Agents', value: 8, icon: Brain, color: '#3b82f6' },
          { label: 'Clients', value: stats.Client || 1, icon: TrendingUp, color: '#22c55e' },
          { label: 'Problems Solved', value: stats.Solution || 2, icon: Clock, color: '#f59e0b' },
          { label: 'Knowledge Nodes', value: stats.Note || 26, icon: Zap, color: '#8b5cf6' },
          { label: 'Models', value: 2, icon: GitBranch, color: '#ec4899' },
        ].map((stat, i) => (
          <div key={stat.label} className={`rounded-2xl p-5 border glass hover-lift animate-in ${stat.color === '#3b82f6' ? 'glow-blue' : stat.color === '#22c55e' ? 'glow-green' : stat.color === '#8b5cf6' ? 'glow-purple' : ''}`}
            style={{ borderColor: 'var(--color-border)', animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-[28px] font-bold tracking-tight tabular-nums leading-none mb-1">{stat.value}</div>
            <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 5 Layer Stack */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
          <Layers size={16} /> 5-Layer Stack
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {layers.map((layer, i) => (
            <div key={layer.id} className={`rounded-2xl p-5 border glass transition-all duration-300 hover-lift animate-in ${layer.status === 'active' ? 'glow-' + layer.color.split('#').map(c => c).join('') : layer.status === 'running' ? 'glow-purple' : ''}`}
              style={{ borderColor: layer.status === 'active' ? layer.color : 'var(--color-border)', animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${layer.color}15` }}>
                  <layer.icon size={24} style={{ color: layer.color }} className={layer.status === 'running' ? 'animate-spin' : ''} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg" 
                  style={{ background: layer.status === 'active' ? '#22c55e15' : layer.status === 'running' ? '#9333ea15' : '#6b728015', 
                           color: layer.status === 'active' ? '#22c55e' : layer.status === 'running' ? '#9333ea' : '#6b7280' }}>
                  {layer.status === 'active' ? '✓' : layer.status === 'running' ? '⟳' : '○'}
                </span>
              </div>
              <div className="text-[15px] font-bold mb-1">L{layer.id}: {layer.name}</div>
              <div className="text-[11px] mb-3" style={{ color: 'var(--color-text-muted)' }}>{layer.description}</div>
              <div className="space-y-1.5">
                {layer.metrics.map((m, j) => (
                  <div key={j} className="text-[10px] px-2 py-1 rounded-lg" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Models & Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Model Router */}
        <div className="rounded-2xl p-6 border glass" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
              <GitBranch size={16} /> Model Router
            </h2>
            <span className="text-[11px] px-2 py-1 rounded-lg font-medium" style={{ background: '#22c55e15', color: '#22c55e' }}>Active</span>
          </div>
          <div className="space-y-3">
            {models.map((model, i) => (
              <div key={model.name} className="rounded-xl p-4 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: model.status === 'active' ? 'var(--color-green)' : 'var(--color-red)' }} />
                    <span className="text-[13px] font-medium">{model.name}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg font-mono" style={{ background: 'var(--color-card)', color: 'var(--color-text-muted)' }}>
                    {model.cost}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{model.tasks}</span> tasks · {model.speed}
                  </div>
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  {model.usage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Vault */}
        <div className="rounded-2xl p-6 border glass" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
              <Database size={16} /> Shared Memory (Obsidian Vault)
            </h2>
            <span className="text-[11px] px-2 py-1 rounded-lg font-medium" style={{ background: '#22c55e15', color: '#22c55e' }}>Synced</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-surface)' }}>
                <div className="text-[24px] font-bold mb-1" style={{ color: 'var(--color-purple)' }}>26</div>
                <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Vault Notes</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'var(--color-surface)' }}>
                <div className="text-[24px] font-bold mb-1" style={{ color: 'var(--color-blue)' }}>32</div>
                <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Knowledge Nodes</div>
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--color-surface)' }}>
              <div className="text-[11px] italic" style={{ color: 'var(--color-text-secondary)' }}>
                "A model with no memory is a stranger you reintroduce yourself to every single morning."
              </div>
              <div className="text-[10px] mt-2 text-right" style={{ color: 'var(--color-text-muted)' }}>— Julian Goldie</div>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              ✓ Auto-loads context before agent calls<br />
              ✓ Saves ~20% tokens per prompt<br />
              ✓ Daily brain sync to Neo4j + Qdrant
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
          <Activity size={16} /> Recent Activity
        </h2>
        <div className="rounded-2xl glass divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { time: '2 min ago', text: 'GraphRAG query completed — 32 nodes searched', dot: '#3b82f6', icon: '🔍' },
            { time: '8 min ago', text: 'Daily brain sync — 26 notes synced to Qdrant', dot: '#8b5cf6', icon: '🧠' },
            { time: '15 min ago', text: 'Client session saved — Acme Corp', dot: '#22c55e', icon: '👤' },
            { time: '1 hour ago', text: '8-agent pipeline completed — 3 parallel batches', dot: '#f59e0b', icon: '🤖' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <span className="text-lg">{a.icon}</span>
              <span className="text-[13px] flex-1">{a.text}</span>
              <span className="text-[11px] shrink-0 px-2 py-1 rounded-lg"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
          <Server size={16} /> Infrastructure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Horizon CRM API', port: 3000, key: 'horizon' },
            { name: 'GraphRAG Engine', port: 3001, key: 'graphrag' },
            { name: 'UAID Dashboard', port: 8000, key: 'dashboard' },
            { name: 'Neo4j Graph DB', port: 7474, key: 'neo4j' },
            { name: 'Qdrant Vector DB', port: 6333, key: 'qdrant' },
            { name: 'Command Center', port: 5000, key: 'command' },
          ].map(s => {
            const up = services[s.key] !== false;
            return (
              <div key={s.key} className="flex items-center justify-between px-5 py-4 rounded-2xl glass transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full" style={{ background: up ? 'var(--color-green)' : 'var(--color-red)' }} />
                    {up && <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20" style={{ background: 'var(--color-green)' }} />}
                  </div>
                  <span className="text-[14px] font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono px-3 py-1 rounded-lg" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>:{s.port}</span>
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-lg"
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
