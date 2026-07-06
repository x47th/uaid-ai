import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Server, Building2, Users, Database, FileText, Settings, Zap } from 'lucide-react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/services', icon: Server, label: 'Services' },
  { to: '/crm', icon: Building2, label: 'CRM' },
  { to: '/portal', icon: Users, label: 'Portal' },
  { to: '/knowledge', icon: Database, label: 'Knowledge' },
  { to: '/logs', icon: FileText, label: 'Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      <aside className="w-52 flex flex-col border-r shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-4 h-12 border-b" style={{ borderColor: 'var(--border)' }}>
          <Zap size={18} style={{ color: 'var(--accent)' }} />
          <span className="font-bold text-sm tracking-tight">Command Center</span>
        </div>
        <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'font-medium' : ''}`
            } style={({ isActive }) => isActive ? { background: '#1e3a5f', color: '#60a5fa' } : { color: 'var(--text-muted)' }}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}