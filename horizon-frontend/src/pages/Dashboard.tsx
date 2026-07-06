import { useEffect, useState } from 'react';
import { getCompanies, getContacts, getDeals } from '../api';
import { Building2, Users, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, contacts: 0, deals: 0 });

  useEffect(() => {
    Promise.all([getCompanies(), getContacts(), getDeals()])
      .then(([c, ct, d]) => setStats({ companies: c.data.length, contacts: ct.data.length, deals: d.data.length }))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.companies}</div><div className="stat-label"><Building2 size={14} style={{ display: 'inline', marginRight: 4 }} />Companies</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--green)' }}>{stats.contacts}</div><div className="stat-label"><Users size={14} style={{ display: 'inline', marginRight: 4 }} />Contacts</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: 'var(--amber)' }}>{stats.deals}</div><div className="stat-label"><Briefcase size={14} style={{ display: 'inline', marginRight: 4 }} />Deals</div></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h2>Welcome to Horizon CRM</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Your AI-powered CRM is ready. Use the sidebar to manage companies, contacts, and deals.
          Each entity is automatically isolated to your workspace (multi-tenant).
        </p>
      </div>
    </div>
  );
}
