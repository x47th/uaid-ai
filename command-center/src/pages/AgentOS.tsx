import { useState, useEffect } from 'react';
import { Brain, Cpu, MessageCircle, Activity, Zap, Clock, CheckCircle, Loader2, BarChart3, Network } from 'lucide-react';

const agents = [
  { name: 'Dr. Amira Al-Rashid', role: 'Strategist', status: 'active', memory: '12.4 MB', tasks: 3, lastAction: '2 min ago', model: 'deepseek-v4-pro' },
  { name: 'Prof. Marcus Chen', role: 'Architect', status: 'active', memory: '8.1 MB', tasks: 2, lastAction: '5 min ago', model: 'deepseek-v4-pro' },
  { name: 'Dr. Sarah Kim', role: 'Researcher', status: 'active', memory: '15.2 MB', tasks: 4, lastAction: '1 min ago', model: 'deepseek-v4-pro' },
  { name: 'James Morrison', role: 'Security', status: 'idle', memory: '4.3 MB', tasks: 0, lastAction: '30 min ago', model: 'deepseek-v4-flash' },
  { name: 'Elena Rodriguez', role: 'UX Designer', status: 'idle', memory: '6.7 MB', tasks: 1, lastAction: '12 min ago', model: 'deepseek-v4-flash' },
  { name: 'Raj Patel', role: 'DevOps', status: 'active', memory: '9.8 MB', tasks: 2, lastAction: '3 min ago', model: 'deepseek-v4-flash' },
  { name: 'Maria Santos', role: 'QA Engineer', status: 'idle', memory: '5.1 MB', tasks: 0, lastAction: '45 min ago', model: 'deepseek-v4-flash' },
  { name: 'David Park', role: 'Tech Writer', status: 'idle', memory: '3.2 MB', tasks: 1, lastAction: '20 min ago', model: 'deepseek-v4-flash' },
];

const tasks = [
  { id: 1, agent: 'Dr. Amira', task: 'Market analysis report', progress: 85, priority: 'High' },
  { id: 2, agent: 'Dr. Sarah', task: 'Literature review: NLP', progress: 60, priority: 'Medium' },
  { id: 3, agent: 'Prof. Marcus', task: 'Architecture review', progress: 40, priority: 'High' },
  { id: 4, agent: 'Raj', task: 'Deployment pipeline', progress: 95, priority: 'Critical' },
];

export default function AgentOS() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const active = agents.filter(a => a.status === 'active').length;
  const totalMem = agents.reduce((s, a) => s + parseFloat(a.memory), 0);

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-in">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-1">
            <span className="text-gradient">Agent OS</span>
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Autonomous agent operating system — monitor, control, and optimize</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Active</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-green)' }}>{active}/8</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Memory</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>{totalMem.toFixed(1)} MB</div>
          </div>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Tasks</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-purple)' }}>{agents.reduce((s,a) => s+a.tasks, 0)}</div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <h2 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Active Agents</h2>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {agents.map(a => (
          <div key={a.name}
            onClick={() => setSelectedAgent(a)}
            className="rounded-xl border p-4 transition-all duration-200 hover-lift cursor-pointer glass"
            style={{ borderColor: a.status === 'active' ? 'rgba(34,197,94,0.3)' : 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" 
                style={{ background: a.status === 'active' ? 'var(--color-green-glow)' : 'var(--color-surface)' }}>
                {a.status === 'active' ? <Zap size={16} style={{ color: 'var(--color-green)' }} /> : <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                style={{ background: a.status === 'active' ? 'var(--color-green-glow)' : 'var(--color-surface)', color: a.status === 'active' ? 'var(--color-green)' : 'var(--color-text-muted)' }}>
                {a.status === 'active' ? 'LIVE' : 'IDLE'}
              </span>
            </div>
            <div className="font-semibold text-[13px] mb-0.5">{a.name.split(' ').slice(0, 2).join(' ')}</div>
            <div className="text-[11px] mb-2" style={{ color: 'var(--color-text-muted)' }}>{a.role}</div>
            <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1"><Brain size={10} />{a.memory}</span>
              <span className="flex items-center gap-1"><Activity size={10} />{a.tasks} tasks</span>
            </div>
            <div className="mt-2 pt-2 border-t text-[10px]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              <span className="font-mono">{a.model}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Task Queue + Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Task Queue */}
        <div className="col-span-2">
          <h2 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Task Queue</h2>
          <div className="rounded-xl border divide-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            {tasks.map(t => (
              <div key={t.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{t.task}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                      t.priority === 'High' ? 'text-red-400 bg-red-400/10' : 'text-amber-400 bg-amber-400/10'
                    }`}>{t.priority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${t.progress}%`, background: 'var(--color-accent)' }} />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>{t.progress}%</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{t.agent}</span>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>No active tasks</div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Activity Feed</h2>
          <div className="rounded-xl border divide-y" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            {[
              { icon: CheckCircle, color: '#22c55e', text: 'Dr. Amira completed market analysis', time: '2 min ago' },
              { icon: MessageCircle, color: '#3b82f6', text: 'Prof. Marcus queried Neo4j graph', time: '5 min ago' },
              { icon: BarChart3, color: '#7c3aed', text: 'Raj deployed new pipeline stage', time: '8 min ago' },
              { icon: Network, color: '#f59e0b', text: 'Brain sync: 23 notes updated', time: '15 min ago' },
              { icon: Zap, color: '#3b82f6', text: 'Agent OS initialized', time: '30 min ago' },
            ].map((e, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                <e.icon size={14} style={{ color: e.color }} />
                <span className="text-[12px] flex-1">{e.text}</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}