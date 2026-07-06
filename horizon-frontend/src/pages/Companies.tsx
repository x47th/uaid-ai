import { useEffect, useState } from 'react';
import { getCompanies, createCompany, deleteCompany } from '../api';
import { Plus, Trash2, Building2 } from 'lucide-react';

interface Company { id: string; name: string; domain?: string; industry?: string; size?: string; contacts?: any[]; deals?: any[]; }

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '', industry: '', size: '' });
  const [toast, setToast] = useState('');

  const load = () => getCompanies().then(r => setCompanies(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCompany(form);
    setModal(false); setForm({ name: '', domain: '', industry: '', size: '' });
    load();
    setToast('Company created');
    setTimeout(() => setToast(''), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this company?')) return;
    await deleteCompany(id);
    load();
    setToast('Company deleted');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Companies ({companies.length})</h2>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Company</button>
        </div>
        {companies.length === 0 ? (
          <div className="empty-state"><Building2 size={48} color="var(--text-secondary)" /><h3>No companies yet</h3><p>Add your first company to get started.</p><button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Company</button></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Domain</th><th>Industry</th><th>Size</th><th>Contacts</th><th>Deals</th><th></th></tr></thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.domain || '—'}</td>
                    <td>{c.industry || '—'}</td>
                    <td>{c.size || '—'}</td>
                    <td>{c.contacts?.length || 0}</td>
                    <td>{c.deals?.length || 0}</td>
                    <td><button className="btn btn-danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Company</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Company Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Domain</label><input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="company.com" /></div>
              <div className="form-group"><label>Industry</label><input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} /></div>
              <div className="form-group"><label>Size</label><input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="1-10, 11-50, 51-200, 201+" /></div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}
