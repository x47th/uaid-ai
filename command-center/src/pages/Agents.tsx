import { useState } from 'react';
import { Bot, Zap, Brain, Cpu, Send } from 'lucide-react';

export default function Agents() {
  const [chat, setChat] = useState<{role:string;content:string}[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setChat(c => [...c, {role:'user', content:input}]);
    setInput('');
    setTimeout(() => setChat(c => [...c, {role:'assistant', content:'🧠 Processing via DeepSeek V4-Pro...\n\nAnalysis: UAID system is operational. All 6 services running. 8 agents available. 32 knowledge nodes active.'}]), 800);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Agents</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Hermes agent control & chat</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{icon:Bot,label:'Hermes Status',val:'Running',color:'var(--green)'},{icon:Brain,label:'Memory Used',val:'78%',color:'var(--amber)'},{icon:Cpu,label:'Skills Loaded',val:'18 custom',color:'var(--accent)'}].map(c => (
          <div key={c.label} className="rounded-lg p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <c.icon size={20} style={{color:c.color}} className="mb-2" />
            <div className="font-medium text-sm">{c.label}</div>
            <div className="text-lg font-bold" style={{color:c.color}}>{c.val}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-2">Agent Chat</h2>
      <div className="rounded-lg border p-4 mb-3 h-64 overflow-auto" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        {chat.length === 0 && <p className="text-sm text-center mt-20" style={{ color: 'var(--text-muted)' }}><Bot size={32} className="mx-auto mb-2" style={{color:'var(--accent)'}} />Send commands to the agent team</p>}
        {chat.map((m,i) => (
          <div key={i} className={`mb-2 ${m.role==='user'?'text-right':''}`}>
            <div className={`inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role==='user'?'text-white':''}`}
              style={m.role==='user'?{background:'var(--accent)'}:{background:'var(--surface)'}}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Send command to agents..." className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
        <button onClick={send} className="rounded-lg px-4 py-2 text-sm font-medium text-white transition" style={{ background: 'var(--accent)' }}><Send size={14} /></button>
      </div>
    </div>
  );
}