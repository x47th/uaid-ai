import { useEffect, useState } from 'react';
import { getDeals, createDeal, updateDeal } from '../api';
import { Plus, Briefcase } from 'lucide-react';

const STAGES = ['lead', 'qualified', 'proposal', 'won', 'lost'];

interface Deal { id: string; name: string; amount?: number; stage: string; company?: { name: string }; contact?: { firstName: string; lastName: string }; }

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', stage: 'lead', companyId: '', contactId: '' });
  const [toast, setToast] = useState('');

  const load = () => getDeals().then(r => setDeals(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDeal({ ...form, amount: parseFloat(form.amount) || undefined });
    setModal(false); setForm({ name: '', amount: '', stage: 'lead', companyId: '', contactId: '' });
    load();
    setToast('Deal created');
    setTimeout(() => setToast(''), 2000);
  };

  const handleStageChange = async (id: string, stage: string) => {
    await updateDeal(id, { stage });
    load();
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Deals ({deals.length})</h2>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Deal</button>
        </div>
        {deals.length === 0 ? (
          <div className="empty-state"><Briefcase size={48} color="var(--text-secondary)" /><h3>No deals yet</h3><p>Create your first deal to start tracking your pipeline.</p><button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Deal</button></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Deal Name</th><th>Amount</th><th>Stage</th><th>Company</th><th>Contact</th></tr></thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.amount ? `$${d.amount.toLocaleString()}` : '—'}</td>
                    <td>
                      <select value={d.stage} onChange={e => handleStageChange(d.id, e.target.value)}
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <span className={`badge badge-${d.stage}`} style={{ marginLeft: 6 }}>{d.stage}</span>
                    </td>
                    <td>{d.company?.name || '—'}</td>
                    <td>{d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : '—'}</td>
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
            <h3>Add Deal</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Deal Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Amount ($)</label><input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
              <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>{STAGES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Company ID *</label><input value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} required /></div>
              <div className="form-group"><label>Contact ID</label><input value={form.contactId} onChange={e => setForm({ ...form, contactId: e.target.value })} /></div>
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
