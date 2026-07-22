import { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Network, Activity, Zap, Clock, CheckCircle, Loader2, 
  BarChart3, MessageCircle, GitBranch, Database, Search, Play, Pause,
  RefreshCw, Shield, Palette, Code, FileText, Rocket, ArrowRight,
  TrendingUp, Users, Wifi, WifiOff, AlertTriangle
} from 'lucide-react';

// Advanced agent models with real capabilities
const AGENTS = [
  { 
    id: 'strategist', name: 'Dr. Amira Al-Rashid', role: 'AI Strategist', 
    status: 'active', memory: 12.4, cpu: 34, tasks: 3, tokens: '4.2M',
    tools: ['market_analysis', 'roi_calc', 'risk_assessor', 'mcp_browser'],
    lastAction: 'Just now — analyzing fraud detection proposal',
    model: 'v4-pro', org: 'MIT PhD · 15yr Fortune 500',
    icon: TrendingUp, color: '#3b82f6'
  },
  { 
    id: 'architect', name: 'Prof. Marcus Chen', role: 'Systems Architect', 
    status: 'active', memory: 8.1, cpu: 28, tasks: 2, tokens: '3.1M',
    tools: ['system_design', 'db_optimizer', 'api_designer', 'graph_search'],
    lastAction: '2 min ago — designing API gateway',
    model: 'v4-pro', org: 'ex-Google Distinguished Engineer',
    icon: Network, color: '#22c55e'
  },
  { 
    id: 'researcher', name: 'Dr. Sarah Kim', role: 'AI Research Director', 
    status: 'active', memory: 15.2, cpu: 45, tasks: 4, tokens: '6.8M',
    tools: ['arxiv_search', 'paper_analyzer', 'benchmark_runner', 'qdrant_search'],
    lastAction: '30 sec ago — finding papers on transformer optimization',
    model: 'v4-pro', org: 'Stanford PhD · 50+ publications',
    icon: Search, color: '#f59e0b'
  },
  { 
    id: 'security', name: 'James Morrison', role: 'Chief Security Officer', 
    status: 'active', memory: 4.3, cpu: 12, tasks: 1, tokens: '1.1M',
    tools: ['vuln_scanner', 'threat_modeler', 'pen_tester', 'compliance'],
    lastAction: '5 min ago — security audit in progress',
    model: 'v4-flash', org: 'ex-NSA · CISSP · OSCP',
    icon: Shield, color: '#ef4444'
  },
  { 
    id: 'ux', name: 'Elena Rodriguez', role: 'UX Director', 
    status: 'idle', memory: 6.7, cpu: 5, tasks: 1, tokens: '0.9M',
    tools: ['design_system', 'accessibility', 'wireframe_gen', 'mcp_browser'],
    lastAction: '12 min ago — reviewed portal design',
    model: 'v4-flash', org: 'ex-Stripe · ex-Linear',
    icon: Palette, color: '#ec4899'
  },
  { 
    id: 'devops', name: 'Raj Patel', role: 'Platform Engineer', 
    status: 'active', memory: 9.8, cpu: 22, tasks: 2, tokens: '2.4M',
    tools: ['k8s_orch', 'terraform', 'prometheus', 'docker_mgr'],
    lastAction: '3 min ago — optimizing deployment pipeline',
    model: 'v4-flash', org: 'ex-Netflix · ex-Shopify',
    icon: Rocket, color: '#06b6d4'
  },
  { 
    id: 'qa', name: 'Maria Santos', role: 'QA Director', 
    status: 'idle', memory: 5.1, cpu: 3, tasks: 0, tokens: '0.6M',
    tools: ['test_gen', 'perf_tester', 'cov_analyzer', 'e2e_runner'],
    lastAction: '45 min ago — test suite passed',
    model: 'v4-flash', org: 'ex-Microsoft QA architect',
    icon: CheckCircle, color: '#84cc16'
  },
  { 
    id: 'writer', name: 'David Park', role: 'Technical Writer', 
    status: 'idle', memory: 3.2, cpu: 2, tasks: 1, tokens: '0.4M',
    tools: ['doc_gen', 'api_docs', 'readme_builder', 'mermaid'],
    lastAction: '20 min ago — documentation generated',
    model: 'v4-flash', org: 'ex-AWS · ex-Vercel',
    icon: FileText, color: '#a855f7'
  },
];

const STATS = [
  { label: 'Total Tokens', value: '19.5M', sub: 'Across 8 agents', color: '#3b82f6', delta: '+2.1M today' },
  { label: 'Parallel Batches', value: '4', sub: 'Concurrent execution', color: '#22c55e', delta: 'Max efficiency' },
  { label: 'Avg Response Time', value: '1.2s', sub: 'V4-Pro: 0.8s | Flash: 0.4s', color: '#f59e0b', delta: '-0.3s from yesterday' },
  { label: 'Success Rate', value: '99.7%', sub: '3 retries max per failure', color: '#a855f7', delta: '+0.2% this week' },
];

const RECENT_ACTIONS = [
  'CEO → Researcher: "Find papers on transformer optimization for fraud detection"',
  'Researcher → Architect: "Key finding — sparse attention reduces latency by 40%"',
  'Architect → DevOps: "Design requires GPU node pool in K8s cluster"',
  'Security → Architect: "Flagged: API endpoint needs rate limiting"',
  'UX → Builder: "Button contrast fails WCAG AA — use semantic tokens"',
  'DevOps → All: "Pipeline v3 deployed — build time reduced 45%"',
  'QA → Team: "Test coverage: 84.3% — 12 new edge cases covered"',
];

export default function AgentOS() {
  const [time, setTime] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'idle'>('all');
  const [pulse, setPulse] = useState(0);
  const wsRef = useRef<number | null>(null);

  // Simulated real-time updates
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const p = setInterval(() => setPulse(x => (x + 1) % 4), 2000);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  const filtered = AGENTS.filter(a => filter === 'all' || a.status === filter);
  const activeCount = AGENTS.filter(a => a.status === 'active').length;
  const totalMem = AGENTS.reduce((s,a) => s + a.memory, 0);
  const totalCpu = AGENTS.reduce((s,a) => s + a.cpu, 0);

  return (
    <div className="flex h-[calc(100vh-4rem)]" style={{ background: 'var(--color-bg)' }}>
      {/* Main content */}
      <div className="flex-1 overflow-auto px-8 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 animate-in">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight mb-1">
              <span className="text-gradient">Agent Operating System</span>
            </h1>
            <p className="text-[13px] flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
              <div className={`w-2 h-2 rounded-full ${pulse % 2 === 0 ? 'pulse-dot' : ''}`} style={{ background: 'var(--color-green)' }} />
              Autonomous agent network — {activeCount}/8 agents active
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 rounded-xl glass">
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Uptime</div>
              <div className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-green)' }}>{time.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl border p-5 glass hover-lift animate-in" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[30px] font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${s.color}15`, color: s.color }}>{s.delta}</div>
              </div>
              <div className="text-[13px] font-semibold">{s.label}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Agent Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>Agent Network</h2>
          <div className="flex gap-1.5">
            {(['all','active','idle'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors capitalize"
                style={filter === f 
                  ? { background: 'var(--color-accent)', color: '#fff' } 
                  : { background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                {f} ({f === 'all' ? 8 : f === 'active' ? activeCount : 8 - activeCount})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {filtered.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={a.id}
                onClick={() => setSelected(selected === a.id ? null : a.id)}
                className="rounded-2xl border p-5 transition-all duration-300 cursor-pointer animate-in glass hover-lift"
                style={{ 
                  borderColor: selected === a.id ? a.color : 'var(--color-border)',
                  boxShadow: selected === a.id ? `0 0 30px ${a.color}15` : 'none',
                  animationDelay: `${i * 0.05}s`
                }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}15` }}>
                    <Icon size={20} style={{ color: a.color }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'pulse-dot' : ''}`}
                      style={{ background: a.status === 'active' ? 'var(--color-green)' : 'var(--color-text-muted)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: a.status === 'active' ? 'var(--color-green)' : 'var(--color-text-muted)' }}>
                      {a.status === 'active' ? 'LIVE' : 'IDLE'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="font-semibold text-[13px] mb-0.5">{a.name.split(' ').slice(0, 2).join(' ')}</div>
                <div className="text-[11px] mb-2" style={{ color: 'var(--color-text-muted)' }}>{a.role}</div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: 'var(--color-surface)' }}>
                    <div className="text-[11px] font-bold" style={{ color: 'var(--color-accent)' }}>{a.memory}MB</div>
                    <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>Memory</div>
                  </div>
                  <div className="rounded-lg px-2 py-1.5 text-center" style={{ background: 'var(--color-surface)' }}>
                    <div className="text-[11px] font-bold" style={{ color: 'var(--color-purple)' }}>{a.cpu}%</div>
                    <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>CPU</div>
                  </div>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {a.tools.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{t}</span>
                  ))}
                  {a.tools.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>+{a.tools.length - 3}</span>
                  )}
                </div>

                {/* Org */}
                <div className="text-[10px] pt-2 border-t" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: a.model === 'v4-pro' ? '#3b82f615' : '#a855f715', color: a.model === 'v4-pro' ? '#3b82f6' : '#a855f7' }}>
                    {a.model}
                  </span>
                  <span className="ml-1.5">{a.org.split('·')[0]}</span>
                </div>

                {/* Expanded details */}
                {selected === a.id && (
                  <div className="mt-3 pt-3 border-t animate-in" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="text-[11px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>{a.lastAction}</div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      <div>Tokens: {a.tokens}</div>
                      <div>Tasks: {a.tasks}</div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {(['Pause','View Logs','Assign']).map(btn => (
                        <button key={btn} className="text-[10px] px-2 py-1 rounded-lg font-medium transition-colors hover:bg-white/5"
                          style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{btn}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Activity Feed */}
        <h2 className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Inter-Agent Communication</h2>
        <div className="rounded-2xl border glass divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {RECENT_ACTIONS.map((action, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3 animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <ArrowRight size={14} style={{ color: '#3b82f6' }} />
              <span className="text-[12px] flex-1 font-mono" style={{ fontSize: '11px' }}>{action}</span>
              <span className="text-[10px] shrink-0 px-2 py-1 rounded-lg" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                {i === 0 ? 'Just now' : `${(i+1)*3} min ago`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Knowledge Graph */}
      <aside className="w-80 border-l shrink-0 p-5 overflow-auto glass" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          <GitBranch size={14} className="inline mr-1.5" />Knowledge Graph
        </h2>

        {/* Graph Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Nodes', val: 34, color: '#3b82f6' },
            { label: 'Edges', val: 47, color: '#22c55e' },
            { label: 'Vectors', val: 23, color: '#a855f7' },
            { label: 'Queries/h', val: '142', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3 text-center glass" style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Queries */}
        <h3 className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Recent Queries</h3>
        <div className="space-y-1.5 mb-4">
          {[
            'Fraud detection UAE banking',
            'Transformer optimization',
            'Supply chain AI solutions',
            'Customer churn prediction',
          ].map((q, i) => (
            <div key={i} className="rounded-lg px-3 py-2 text-[11px] font-mono cursor-pointer transition-colors hover:bg-white/[0.03]"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
              <Search size={10} className="inline mr-1.5" style={{ color: 'var(--color-text-muted)' }} />{q}
            </div>
          ))}
        </div>

        {/* Agent Connections */}
        <h3 className="text-[11px] font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Agent Connections</h3>
        <div className="space-y-1.5">
          {[
            { from: 'Strategist', to: 'Researcher', strength: 8 },
            { from: 'Researcher', to: 'Architect', strength: 7 },
            { from: 'Architect', to: 'DevOps', strength: 6 },
            { from: 'Security', to: 'Architect', strength: 5 },
            { from: 'QA', to: 'All agents', strength: 4 },
          ].map((c, i) => (
            <div key={i} className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: 'var(--color-surface)' }}>
              <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{c.from} → {c.to}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: c.strength }).map((_, j) => (
                  <div key={j} className="w-1 h-3 rounded-full" style={{ background: j < 3 ? '#22c55e' : j < 6 ? '#f59e0b' : '#3b82f6' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}