import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Plus } from 'lucide-react';

const categories = ['Automation', 'Analytics', 'Chatbot', 'Infrastructure', 'Security', 'Other'];

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/companies?take=50').then(r => setSolutions(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Solutions</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Solution
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {categories.map(cat => (
          <div key={cat} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <Lightbulb className="text-yellow-400 mb-2" size={20} />
            <div className="font-semibold text-sm">{cat}</div>
            <div className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 5)} solutions</div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-3">Recent Solutions</h3>
      <div className="space-y-3">
        {solutions.slice(0, 5).map(s => (
          <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-gray-500">{s.domain || 'No description'}</div>
            </div>
            <span className="bg-blue-900 text-blue-400 px-2 py-0.5 rounded text-xs">Draft</span>
          </div>
        ))}
      </div>
    </div>
  );
}