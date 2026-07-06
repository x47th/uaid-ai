import { useState } from 'react';
import { login, register, setToken } from '../api';
import { Building2 } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tenant, setTenant] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const fn = mode === 'login' ? login : register;
      const args = mode === 'login' ? [email, password] : [email, password, name, tenant];
      const { data } = await (fn as any)(...args);
      setToken(data.access_token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Connection failed — is Horizon API running?');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Building2 size={40} color="var(--accent)" />
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>Horizon CRM</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{mode === 'login' ? 'Sign in to your account' : 'Create a new workspace'}</p>
        </div>
        {error && <div style={{ background: '#ef444420', color: '#f87171', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="form-group"><label>Company / Workspace</label><input value={tenant} onChange={e => setTenant(e.target.value)} required /></div>
            </>
          )}
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }} type="submit">
            {mode === 'login' ? 'Sign In' : 'Create Workspace'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
