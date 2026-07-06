import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

let token = localStorage.getItem('horizon_token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const setToken = (t: string) => {
  token = t;
  localStorage.setItem('horizon_token', t);
  api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
};

export const getToken = () => token;

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (email: string, password: string, name: string, tenantName: string) =>
  api.post('/auth/register', { email, password, name, tenantName });

export const getCompanies = () => api.get('/companies');
export const createCompany = (data: any) => api.post('/companies', data);
export const updateCompany = (id: string, data: any) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id: string) => api.delete(`/companies/${id}`);

export const getContacts = () => api.get('/contacts');
export const createContact = (data: any) => api.post('/contacts', data);

export const getDeals = () => api.get('/deals');
export const createDeal = (data: any) => api.post('/deals', data);
export const updateDeal = (id: string, data: any) => api.put(`/deals/${id}`, data);

export default api;
