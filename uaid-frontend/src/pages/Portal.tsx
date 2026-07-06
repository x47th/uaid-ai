import { useState, useEffect } from 'react';
import { Bot, Send, CheckCircle, Clock, AlertCircle, Building2, TrendingUp } from 'lucide-react';

export default function Portal() {
  const [messages, setMessages] = useState<{role:string;content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const project = {
    name: 'Supply Chain AI Optimization',
    client: 'Acme Logistics',
    progress: 65,
    nextMilestone: 'Model Training — July 15',
    timeline: [
      { phase: 'Discovery', done: true, date: 'Jun 1' },
      { phase: 'Architecture', done: true, date: 'Jun 15' },
      { phase: 'Development', done: true, date: 'Jul 1' },
      { phase: 'Testing', done: false, date: 'Jul 15' },
      { phase: 'Deployment', done: false, date: 'Aug 1' },
    ],
    deliverables: [
      { name: 'Data Pipeline', status: 'done' },
      { name: 'AI Model', status: 'in_progress' },
      { name: 'Dashboard', status: 'pending' },
      { name: 'API Integration', status: 'pending' },
    ],
  };

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setMessages(m => [...m, {role:'user',content:q}]);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/graphrag/query', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({query: `[Client: ${project.client}] ${q}`})});
      const d = await res.json();
      setMessages(m => [...m, {role:'assistant',content: d.ai_answer || 'Processing...'}]);
    } catch {
      setMessages(m => [...m, {role:'assistant',content:'Connecting to UAID brain...'}]);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)]">
      {/* Left: Project Dashboard */}
      <div className="w-1/2 space-y-6 overflow-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{project.client}</h2>
            <p className="text-gray-400 text-sm">{project.name}</p>
          </div>
          <Building2 className="text-blue-400" size={28} />
        </div>

        {/* Progress */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Project Progress</span>
            <span className="text-lg font-bold text-blue-400">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
            <div className="bg-blue-600 h-2 rounded-full" style={{width:`${project.progress}%`}} />
          </div>
          <p className="text-xs text-gray-400">Next: {project.nextMilestone}</p>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Timeline</h3>
          {project.timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              {t.done ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-yellow-500" />}
              <span className="text-sm flex-1">{t.phase}</span>
              <span className="text-xs text-gray-500">{t.date}</span>
            </div>
          ))}
        </div>

        {/* Deliverables */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Deliverables</h3>
          {project.deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              {d.status === 'done' ? <CheckCircle size={14} className="text-green-500" /> :
               d.status === 'in_progress' ? <TrendingUp size={14} className="text-blue-500" /> :
               <AlertCircle size={14} className="text-gray-600" />}
              <span className="text-sm">{d.name}</span>
              <span className="text-xs ml-auto text-gray-500">
                {d.status === 'done' ? 'Completed' : d.status === 'in_progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: AI Chat */}
      <div className="w-1/2 flex flex-col">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bot size={20} className="text-blue-400" /> AI Project Assistant
        </h3>
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-auto mb-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-16 text-sm">
              Ask about your project timeline, deliverables, or any questions about the solution
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                m.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-xs">🧠 Thinking...</div>}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about your project..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500" />
          <button onClick={send} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}