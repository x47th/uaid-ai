import { useState } from 'react';
import { Bot, Brain, Cpu, Zap, Send, ChevronRight } from 'lucide-react';

const skills = ['uaid-ai','brain-sync','horizon-crm','cost-tracking','skillmaxxing','shared-embeddings','knowledge-feedback','loop-triage','loop-verifier','loop-budget','graphify'];

export default function Agents() {
  const [chat, setChat] = useState<{role:string;content:string}[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setChat(c => [...c, {role:'user', content:input}]);
    setInput('');
    setTimeout(() => setChat(c => [...c, {role:'assistant', content:'All 8 agents active. 18 custom skills loaded. DeepSeek V4-Pro connected. 32 knowledge nodes available. Ready for your command.'}]), 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight mb-1">Agents</h1>
        <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Hermes agent team — control & monitoring</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{icon:Bot,label:'Status',val:'Running',sub:'All agents active',color:'#22c55e'},{icon:Brain,label:'Memory',val:'78%',sub:'User + Agent stores',color:'#f59e0b'},{icon:Cpu,label:'Skills',val:'18 custom',sub:'267 total available',color:'#3b82f6'}].map(c => (
          <div key={c.label} className="rounded-xl p-5 border" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${c.color}15` }}>
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <div className="text-[22px] font-bold tracking-tight tabular-nums mb-0.5">{c.val}</div>
            <div className="text-[13px] font-medium">{c.label}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Active Skills</h2>
          <div className="rounded-xl border divide-y max-h-64 overflow-auto" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            {skills.map(s => (
              <div key={s} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[12px] font-medium">{s}</span>
                <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--color-text-secondary)' }}>Agent Chat</h2>
          <div className="rounded-xl border p-4 mb-3 h-72 overflow-auto" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            {chat.length === 0 && (
              <div className="text-center mt-24">
                <Zap size={32} className="mx-auto mb-3" style={{ color: 'var(--color-accent)' }} />
                <p className="text-[13px] font-medium mb-1">Agent Chat</p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Send commands to the 8-agent team</p>
              </div>
            )}
            {chat.map((m,i) => (
              <div key={i} className={`mb-3 ${m.role==='user'?'text-right':''}`}>
                <div className={`inline-block max-w-[80%] rounded-xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  m.role==='user'?'text-white':''
                }`} style={m.role==='user'?{background:'var(--color-accent)'}:{background:'var(--color-surface)'}}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Send command to agents..."
              className="flex-1 rounded-xl px-4 py-2.5 text-[13px] border outline-none transition-colors focus:border-blue-500"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            <button onClick={send} className="rounded-xl px-4 py-2.5 text-white transition-colors hover:opacity-90"
              style={{ background: 'var(--color-accent)' }}><Send size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}