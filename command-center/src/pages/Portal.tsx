const submissions = [
  { client: 'Acme Logistics', problem: 'Supply chain delays', status: 'In Progress', date: 'Jul 4', verdict: 'AI automation recommended' },
  { client: 'Dubai Finance', problem: 'Fraud detection', status: 'Completed', date: 'Jun 28', verdict: 'Deep learning model deployed' },
  { client: 'HealthPlus', problem: 'Patient scheduling', status: 'Pending', date: 'Jul 5', verdict: '-' },
];

const colors: any = { 'In Progress': 'var(--accent)', 'Completed': 'var(--green)', 'Pending': 'var(--amber)' };

export default function Portal() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Client Portal</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Problem submissions & verdicts</p>
      <div className="space-y-2">
        {submissions.map((s, i) => (
          <div key={i} className="rounded-lg border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{s.client}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${colors[s.status]}15`, color: colors[s.status] }}>{s.status}</span>
            </div>
            <div className="text-sm mb-1">{s.problem}</div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{s.date}</span>
              <span>Verdict: {s.verdict}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}