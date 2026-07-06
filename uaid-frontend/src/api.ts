import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:3001' });
export const crmApi = axios.create({ baseURL: 'http://localhost:3000' });

// GraphRAG
export const graphQuery = (q: string) => api.post('/graphrag/query', { query: q });
export const graphStats = () => api.get('/graphrag/stats');
export const semanticSearch = (q: string) => api.get('/graphrag/semantic', { params: { q } });

// CRM
export const getClients = () => axios.get('http://localhost:3000/companies');
export const getProjects = () => axios.get('http://localhost:3000/deals');
export const getSolutions = () => axios.get('http://localhost:3000/companies');