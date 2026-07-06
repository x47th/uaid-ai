import { useRef } from 'react';
import { Search } from 'lucide-react';

export default function Knowledge() {
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-bold mb-1">Knowledge</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Neo4j graph browser + Qdrant vector search</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg p-4 border text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>32</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Neo4j Nodes</div>
        </div>
        <div className="rounded-lg p-4 border text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color: '#a855f7' }}>23</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Qdrant Vectors</div>
        </div>
      </div>

      <h2 className="text-sm font-semibold mb-2">Neo4j Graph Browser</h2>
      <div className="rounded-lg border overflow-hidden mb-4" style={{ height: 400, borderColor: 'var(--border)' }}>
        <iframe ref={ref} src="http://localhost:7474" className="w-full h-full border-0" title="Neo4j Browser" />
      </div>
    </div>
  );
}