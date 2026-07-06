import { NavLink } from 'react-router-dom';
import { Command, Bot, Server, Building2, Users, Database, FileText, Settings, Zap, Sparkles, MessageCircle } from 'lucide-react';

const groups = {
  'Overview': [
    { to: '/', icon: Command, label: 'Dashboard', badge: 'Live' },
    { to: '/chat', icon: MessageCircle, label: 'AI Chat', badge: 'Ask AI' },
    { to: '/agents', icon: Bot, label: 'Agents', badge: '8 active' },
    { to: '/services', icon: Server, label: 'Services', badge: '7 online' },
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
    <div className="flex h-screen" style={{ background: 'var(--color-bg)' }}>
      <aside className="w-56 flex flex-col shrink-0 select-none glass border-r-0">
        <div className="flex items-center gap-2.5 px-4 h-14 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center glow-blue"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">Command Center</div>
            <div className="text-[10px] flex items-center gap-1" style={{ color: 'var(--color-green)' }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--color-green)' }} />
              All systems go
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-5 px-3 py-5 overflow-auto">
          {Object.entries(groups).map(([heading, items]) => (
            <div key={heading}>
              <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.15em] uppercase"
                style={{ color: 'var(--color-text-muted)' }}>{heading}</p>
              {items.map(({ to, icon: Icon, label, badge }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 mb-0.5 ${
                      isActive ? 'active-nav' : 'hover:bg-white/[0.03]'
                    }`}>
                  <Icon size={16} strokeWidth={1.5} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                      style={badge.includes('online') || badge.includes('Live')
                        ? { background: 'var(--color-green-glow)', color: 'var(--color-green)' }
                        : { background: 'var(--color-accent-glow)', color: 'var(--color-accent)' }}>
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-purple-glow)' }}>
              <Sparkles size={14} style={{ color: 'var(--color-purple)' }} />
            </div>
            <div>
              <div className="text-[11px] font-medium">Self-Evolving</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>23 commits · v1.0</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ background: 'var(--color-bg)' }}>
        {children}
      </main>
    </div>
  );
}