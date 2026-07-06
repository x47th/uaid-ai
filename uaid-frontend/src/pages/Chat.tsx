import { useState } from 'react';
import { graphQuery } from '../api';
import { Bot, Send } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const { data } = await graphQuery(q);
      setMessages(m => [...m, { role: 'assistant', content: data.ai_answer || 'No response' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Error connecting to UAID brain.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <h2 className="text-2xl font-bold mb-4">AI Chat</h2>
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-auto mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Bot size={48} className="mx-auto mb-4 text-blue-400" />
            <p className="text-lg">Ask UAID AI anything</p>
            <p className="text-sm mt-2">Powered by GraphRAG — Neo4j + Qdrant + DeepSeek</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-4 ${m.role === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
            }`}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">🧠 Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about clients, projects, solutions..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500" />
        <button onClick={send} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}