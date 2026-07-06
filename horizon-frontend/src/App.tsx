import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import { getToken } from './api';

export default function App() {
  const [auth, setAuth] = useState(!!getToken());

  if (!auth) return <Login onLogin={() => setAuth(true)} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onLogout={() => { localStorage.removeItem('horizon_token'); setAuth(false); }} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
