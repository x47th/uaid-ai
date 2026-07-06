import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Briefcase, LogOut } from 'lucide-react';

export default function Layout({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">Horizon</div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/companies" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Building2 size={18} /> Companies
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Contacts
          </NavLink>
          <NavLink to="/deals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Briefcase size={18} /> Deals
          </NavLink>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button className="sidebar-link" onClick={onLogout} style={{ width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="header">
          <h1>CRM</h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Project Horizon v1.0</div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
