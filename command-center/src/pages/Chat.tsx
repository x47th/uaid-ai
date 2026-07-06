import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{role:string;content:string;tokens?:number}[]>([
    {role:'assistant', content:'👋 Welcome to UAID AI! I am powered by GraphRAG — combining Neo4j knowledge graph (32 nodes), Qdrant semantic search (23 vectors), and DeepSeek V4 reasoning.\n\nAsk me anything about AI solutions for your business.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:3001/graphrag/query', { query: q }, { timeout: 30000 });
      setMessages(m => [...m, { role: 'assistant', content: data.ai_answer || 'I analyzed your question but need more context. Could you be more specific?', tokens: data.tokens }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ The AI brain is temporarily unavailable. Please try again or contact support.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6 animate-in">
        <h1 className="text-[22px] font-bold tracking-tight mb-1">
          <span className="text-gradient">AI Assistant</span>
        </h1>
        <p className="text-[13px] flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-purple)' }} />
          Powered by GraphRAG — Neo4j + Qdrant + DeepSeek V4
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto mb-4 space-y-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-in ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animationDelay: '0.05s' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={m.role === 'user' 
                ? { background: 'var(--color-accent)' } 
                : { background: 'var(--color-purple-glow)' }}>
              {m.role === 'user' ? <User size={15} className="text-white" /> : <Bot size={15} style={{ color: 'var(--color-purple)' }} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
              m.role === 'user' ? 'text-white' : 'glass'
            }`} style={m.role === 'user' ? { background: 'var(--color-accent)' } : { borderColor: 'var(--color-border)' }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              {m.tokens && (
                <div className="text-[10px] mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  {m.tokens} tokens · DeepSeek V4
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-purple-glow)' }}>
              <Loader2 size={15} className="animate-spin" style={{ color: 'var(--color-purple)' }} />
            </div>
            <div className="glass rounded-2xl px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full skeleton" />
                <div className="w-2 h-2 rounded-full skeleton" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full skeleton" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about AI solutions, automation, analytics..."
            disabled={loading}
            className="w-full rounded-2xl px-5 py-3.5 text-[13px] outline-none transition-all duration-200 glass"
            style={{ 
              borderColor: 'var(--color-border)', color: 'var(--color-text)',
              background: 'var(--color-card)'
            }}
          />
        </div>
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-2xl px-5 py-3.5 text-white font-medium transition-all duration-200 disabled:opacity-40 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}