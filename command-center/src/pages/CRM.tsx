import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';

export default function CRM() {
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">CRM</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Horizon CRM — Companies, Contacts, Deals</p>
      <div className="flex gap-2 mb-3">
        <a href="http://localhost:5173" target="_blank" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>
          <ExternalLink size={14} /> Open Full CRM
        </a>
      </div>
      <div className="rounded-lg border overflow-hidden" style={{ height: 'calc(100vh - 200px)', borderColor: 'var(--border)' }}>
        <iframe ref={ref} src="http://localhost:5173" className="w-full h-full border-0" title="Horizon CRM" />
      </div>
    </div>
  );
}