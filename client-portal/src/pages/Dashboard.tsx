import { Link } from 'react-router-dom';
import { Plus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const problems = [
  { id: 1, title: 'Supply chain optimization', status: 'Accepted', date: 'Jul 4', verdict: 'YES' },
  { id: 2, title: 'Customer churn prediction', status: 'In Progress', date: 'Jul 2', verdict: 'YES' },
  { id: 3, title: 'Inventory management automation', status: 'Rejected', date: 'Jun 28', verdict: 'NO' },
  { id: 4, title: 'Employee scheduling AI', status: 'Pending', date: 'Jul 5', verdict: '-' },
];

const colors: any = { 'Accepted': '#22c55e', 'In Progress': '#3b82f6', 'Rejected': '#ef4444', 'Pending': '#f59e0b' };
const icons: any = { 'Accepted': CheckCircle, 'In Progress': Clock, 'Rejected': XCircle, 'Pending': AlertCircle };

export default function Dashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="font-bold text-lg">UAID AI</span>
        <div className="flex items-center gap-3">
          <Link to="/submit" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Plus size={15} /> New Problem
          </Link>
          <Link to="/profile" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Profile</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Your problem submissions and their status</p>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[{ label: 'Total', val: problems.length }, { label: 'Accepted', val: 1, c: '#22c55e' }, { label: 'In Progress', val: 1, c: '#3b82f6' }, { label: 'Rejected', val: 1, c: '#ef4444' }].map(s => (
            <div key={s.label} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-2xl font-bold" style={{ color: s.c }}>{s.val}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {problems.map(p => {
            const Icon = icons[p.status];
            return (
              <Link key={p.id} to={`/problem/${p.id}`} className="flex items-center justify-between rounded-xl border px-5 py-4 transition-colors hover:bg-white/[0.02]" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Icon size={18} style={{ color: colors[p.status] }} />
                  <div>
                    <div className="font-medium text-sm">{p.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{p.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.verdict !== '-' && (
                    <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: p.verdict === 'YES' ? '#22c55e15' : '#ef444415', color: p.verdict === 'YES' ? '#22c55e' : '#ef4444' }}>
                      {p.verdict}
                    </span>
                  )}
                  <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: `${colors[p.status]}15`, color: colors[p.status] }}>{p.status}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}