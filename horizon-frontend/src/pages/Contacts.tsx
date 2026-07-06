import { useEffect, useState } from 'react';
import { getContacts, createContact } from '../api';
import { Plus, Users } from 'lucide-react';

interface Contact { id: string; firstName: string; lastName: string; email?: string; phone?: string; title?: string; company?: { name: string }; }

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', title: '', companyId: '' });
  const [toast, setToast] = useState('');

  const load = () => getContacts().then(r => setContacts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact(form);
    setModal(false); setForm({ firstName: '', lastName: '', email: '', phone: '', title: '', companyId: '' });
    load();
    setToast('Contact created');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Contacts ({contacts.length})</h2>
          <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Contact</button>
        </div>
        {contacts.length === 0 ? (
          <div className="empty-state"><Users size={48} color="var(--text-secondary)" /><h3>No contacts yet</h3><p>Add your first contact to get started.</p><button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Contact</button></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Title</th><th>Company</th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.title || '—'}</td>
                    <td>{c.company?.name || '—'}</td>
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
            <h3>Add Contact</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required /></div>
              <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group"><label>Company ID</label><input value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} placeholder="UUID from Companies page" /></div>
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
