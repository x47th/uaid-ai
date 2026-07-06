import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); nav('/dashboard'); }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Brain size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Sign in to your UAID account</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
              <input type="email" required className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border outline-none transition-colors focus:border-blue-500"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
              <input type={show ? 'text' : 'password'} required className="w-full rounded-xl pl-10 pr-10 py-2.5 text-sm border outline-none transition-colors focus:border-blue-500"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3"><Eye size={16} style={{ color: 'var(--text-secondary)' }} /></button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}