import { useState, useEffect } from 'react';
import { graphStats } from '../api';
import { Users, FolderKanban, Lightbulb, Activity, ExternalLink } from 'lucide-react';

function StatCard({ label, value, subtitle, icon: Icon, accent }: { label: string; value: string | number; subtitle: string; icon: any; accent: string }) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-0.5 tabular-nums">{value || 0}</div>
      <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 border animate-shimmer" style={{ background: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
      <div className="w-9 h-9 rounded-lg mb-3" style={{ background: 'var(--color-border)' }} />
      <div className="h-6 w-12 rounded mb-2" style={{ background: 'var(--color-border)' }} />
      <div className="h-4 w-20 rounded" style={{ background: 'var(--color-border)' }} />
    </div>
  );
}

function ServiceRow({ name, port }: { name: string; port: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border" style={{ background: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-success)' }} />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>:{port}</span>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: '#16a34a15', color: 'var(--color-success)' }}>Live</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    graphStats()
      .then(r => { setStats(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const services = [
    { name: 'GraphRAG API', port: 3001 },
    { name: 'Horizon CRM', port: 3000 },
    { name: 'Neo4j Graph', port: 7474 },
    { name: 'Qdrant Vector', port: 6333 },
    { name: 'Open WebUI', port: 8080 },
    { name: 'UAID Dashboard', port: 8000 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold mb-1">Overview</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Real-time intelligence from your AI brain</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="col-span-4 rounded-xl p-6 border text-center" style={{ background: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Unable to load stats</p>
            <button onClick={() => window.location.reload()} className="mt-2 text-sm font-medium" style={{ color: 'var(--color-accent)' }}>Retry</button>
          </div>
        ) : (
          <>
            <StatCard label="Clients" value={stats?.find((s: any) => s.type === 'Client')?.count || 0} subtitle="Active accounts" icon={Users} accent="#3b82f6" />
            <StatCard label="Problems" value={stats?.find((s: any) => s.type === 'Problem')?.count || 0} subtitle="Identified issues" icon={FolderKanban} accent="#f59e0b" />
            <StatCard label="Solutions" value={stats?.find((s: any) => s.type === 'Solution')?.count || 0} subtitle="AI-designed fixes" icon={Lightbulb} accent="#10b981" />
            <StatCard label="Knowledge" value={stats?.find((s: any) => s.type === 'Note')?.count || 0} subtitle="Brain notes" icon={Activity} accent="#8b5cf6" />
          </>
        )}
      </div>

      {/* Services Status */}
      <h2 className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {services.map(s => <ServiceRow key={s.port} {...s} />)}
      </div>
    </div>
  );
}