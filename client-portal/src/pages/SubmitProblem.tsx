import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';

export default function SubmitProblem() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); setTimeout(() => nav('/verdict/5'), 1500); }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent)' }}>
            <Loader2 size={28} className="animate-spin text-white" />
          </div>
          <h1 className="text-xl font-bold mb-2">Analyzing your problem...</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Our 8-agent AI team is researching and diagnosing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-1">Submit a Problem</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Describe your business challenge and our AI team will analyze it</p>
        <form onSubmit={handleSubmit} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Problem Description</label>
            <textarea required rows={5} placeholder="Describe your business problem in detail..."
              className="w-full rounded-xl p-3 text-sm border outline-none resize-none transition-colors focus:border-blue-500"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Industry</label>
              <select className="w-full rounded-xl p-2.5 text-sm border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                {['Technology','Finance','Healthcare','Logistics','Retail','Manufacturing','Government','Education'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Urgency</label>
              <select className="w-full rounded-xl p-2.5 text-sm border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                {['Low','Medium','High','Critical'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Budget Range</label>
            <select className="w-full rounded-xl p-2.5 text-sm border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
              {['< $10,000','$10,000 - $50,000','$50,000 - $100,000','$100,000+','Not sure yet'].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Send size={15} /> Submit for AI Diagnosis
          </button>
        </form>
      </div>
    </div>
  );
}