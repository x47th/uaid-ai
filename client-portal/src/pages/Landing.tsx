import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Zap, Brain } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Brain size={24} style={{ color: 'var(--accent)' }} />
          <span className="font-bold text-lg">UAID AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>Login</Link>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-colors" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>Get Started</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-8" style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}>
          <Sparkles size={14} /> AI-Powered Business Solutions
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          If it's a problem,<br />
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            we'll find the AI fix. Period.
          </span>
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Submit your business problem. Our 8-agent AI team diagnoses it, researches solutions, and delivers a verdict — usually within minutes.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium text-lg transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="px-8 py-3.5 rounded-xl font-medium text-lg border transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Login
          </Link>
        </div>
      </main>

      <div className="max-w-5xl mx-auto px-8 pb-24 grid grid-cols-3 gap-6">
        {[
          { icon: Zap, title: 'AI Diagnosis', desc: '8 specialized agents analyze your problem from every angle' },
          { icon: Shield, title: 'Verified Solutions', desc: 'Every solution is validated by our QA and security experts' },
          { icon: Brain, title: 'Continuous Learning', desc: 'Our AI gets smarter with every problem solved' },
        ].map(f => (
          <div key={f.title} className="rounded-2xl p-6 border text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <f.icon size={28} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}