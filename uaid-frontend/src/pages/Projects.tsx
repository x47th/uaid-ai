import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

export default function Projects() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/deals?take=50').then(r => setDeals(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Project
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Discovery', 'Proposal', 'In Progress', 'Completed'].map((stage, i) => (
          <div key={stage} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">{stage}</h3>
            {deals.filter(d => d.stage === stage.toLowerCase()).map(d => (
              <div key={d.id} className="bg-gray-800 rounded-lg p-3 mb-2">
                <div className="font-medium text-sm">{d.name || d.title}</div>
                <div className="text-xs text-gray-500 mt-1">${d.value || 0} · {d.company || 'N/A'}</div>
              </div>
            ))}
            {deals.filter(d => d.stage === stage.toLowerCase()).length === 0 && (
              <div className="text-xs text-gray-600 py-2">No projects</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}