import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center animate-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--color-amber-glow)' }}>
          <AlertTriangle size={32} style={{ color: 'var(--color-amber)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--color-accent)' }}>
          <Home size={15} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}