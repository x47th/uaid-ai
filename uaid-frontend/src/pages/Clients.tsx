import { useState, useEffect } from 'react';
import { getClients } from '../api';
import { Plus, Search } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/companies?take=50').then(r => setClients(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Add Client
        </button>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Domain</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-t border-gray-800 hover:bg-gray-850">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-400">{c.domain || '-'}</td>
                <td className="px-4 py-3"><span className="bg-green-900 text-green-400 px-2 py-0.5 rounded text-xs">Active</span></td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No clients yet. Create your first client.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import axios from 'axios';