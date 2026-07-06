import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Lightbulb, Bot, Building2, Bolt } from 'lucide-react';

const primary = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/solutions', icon: Lightbulb, label: 'Solutions' },
];
const tools = [
  { to: '/chat', icon: Bot, label: 'AI Chat' },
  { to: '/portal', icon: Building2, label: 'Portal' },
];

function NavGroup({ items, heading }: { items: typeof primary; heading: string }) {
  return (
    <div>
      <p className="px-3 mb-1 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>{heading}</p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white' : ''}`
        } style={({ isActive }) => isActive ? { background: 'var(--color-accent-muted)', color: '#60a5fa' } : { color: 'var(--color-text-secondary)' } }>
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: 'var(--color-surface)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r shrink-0" style={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2.5 px-4 h-14 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
            <Bolt size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm">UAID AI</span>
        </div>
        <nav className="flex-1 flex flex-col gap-5 px-2.5 py-4 overflow-auto">
          <NavGroup items={primary} heading="Workspace" />
          <NavGroup items={tools} heading="Tools" />
        </nav>
        <div className="px-4 py-3 border-t text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          v1.0 · Self-evolving
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}