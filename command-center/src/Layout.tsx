import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Server, Building2, Users, Database, FileText, Settings, Zap, Command } from 'lucide-react';

const groups = {
  'Overview': [
    { to: '/', icon: Command, label: 'Dashboard' },
    { to: '/agents', icon: Bot, label: 'Agents' },
    { to: '/services', icon: Server, label: 'Services' },
  ],
  'Workspace': [
    { to: '/crm', icon: Building2, label: 'CRM' },
    { to: '/portal', icon: Users, label: 'Portal' },
    { to: '/knowledge', icon: Database, label: 'Knowledge' },
  ],
  'System': [
    { to: '/logs', icon: FileText, label: 'Logs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: 'var(--color-app-bg)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r shrink-0 select-none"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-12 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Command Center</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-5 px-3 py-4 overflow-auto">
          {Object.entries(groups).map(([heading, items]) => (
            <div key={heading}>
              <p className="px-2 mb-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--color-text-muted)' }}>{heading}</p>
              {items.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors mb-0.5 ${
                      isActive ? 'text-blue-300' : 'hover:text-white'
                    }`}
                  style={({ isActive }: { isActive: boolean }) => isActive
                    ? { background: '#1e3a5f' }
                    : { background: 'transparent' }}>
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-green)' }} />
            v1.0 · All systems operational
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto" style={{ background: 'var(--color-app-bg)' }}>
        {children}
      </main>
    </div>
  );
}