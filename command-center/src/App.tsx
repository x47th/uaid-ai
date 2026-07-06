import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Services from './pages/Services';
import CRM from './pages/CRM';
import Portal from './pages/Portal';
import Knowledge from './pages/Knowledge';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Chat from './pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/services" element={<Services />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}