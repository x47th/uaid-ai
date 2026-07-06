import { useState, useEffect } from 'react';
import { graphStats } from '../api';
import { Users, FolderKanban, Lightbulb, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { graphStats().then(r => setStats(r.data)).catch(() => {}); }, []);

  const cards = [
    { label: 'Clients', value: stats?.find((s: any) => s.type === 'Client')?.count || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Projects', value: stats?.find((s: any) => s.type === 'Problem')?.count || 0, icon: FolderKanban, color: 'text-green-400' },
    { label: 'Solutions', value: stats?.find((s: any) => s.type === 'Solution')?.count || 0, icon: Lightbulb, color: 'text-yellow-400' },
    { label: 'Knowledge Notes', value: stats?.find((s: any) => s.type === 'Note')?.count || 0, icon: Activity, color: 'text-purple-400' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <Icon className={`${color} mb-2`} size={24} />
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-3">Services Status</h3>
      <div className="grid grid-cols-2 gap-3">
        {['GraphRAG API :3001', 'Horizon CRM :3000', 'Neo4j Graph :7474', 'Qdrant Vector :6333'].map(s => (
          <div key={s} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}