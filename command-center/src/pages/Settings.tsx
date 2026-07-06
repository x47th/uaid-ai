import { Key, Database, Globe, Shield } from 'lucide-react';

const configs = [
  { icon: Key, label: 'DeepSeek API Key', value: 'sk-••••••••••••••••••', env: 'DEEPSEEK_API_KEY' },
  { icon: Database, label: 'Neo4j Password', value: '••••••••••••', env: 'NEO4J_PASSWORD' },
  { icon: Globe, label: 'Base URL', value: 'https://api.deepseek.com/v1', env: 'DEEPSEEK_BASE_URL' },
  { icon: Shield, label: 'JWT Secret', value: '••••••••••••••••', env: 'JWT_SECRET' },
];

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Settings</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Configuration & environment</p>
      
      <div className="space-y-2">
        {configs.map(c => (
          <div key={c.env} className="rounded-lg border px-4 py-3 flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <c.icon size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{c.env}</div>
              </div>
            </div>
            <div className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="font-medium text-sm mb-3">Self-Evolution</h3>
        <div className="grid grid-cols-2 gap-2">
          {[{label:'Skill Auto-Generation',on:true},{label:'Nudge Engine',on:true},{label:'Verbose Mode',on:true},{label:'Daily Optimization',on:true}].map(t => (
            <div key={t.label} className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: 'var(--surface)' }}>
              <span className="text-xs">{t.label}</span>
              <span className="text-xs font-medium" style={{ color: t.on ? 'var(--green)' : 'var(--text-muted)' }}>{t.on ? 'Enabled' : 'Disabled'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}