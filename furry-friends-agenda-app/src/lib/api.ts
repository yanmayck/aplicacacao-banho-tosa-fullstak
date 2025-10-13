import { useAuth } from '@/context/AuthContext';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set in environment, use that
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Use /api prefix which will be proxied by Vite dev server to backend
  // In production, this should be configured to point to the deployed backend
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Função para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('petshop-token');
};

// Wrapper de fetch para incluir o token de autenticação
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An error occurred');
  }

  // Se a resposta não tiver corpo (ex: 204 No Content), retorna um objeto vazio
  if (response.status === 204) {
    return {};
  }

  return response.json();
};

// API para Clientes
export const clientApi = {
  getClients: () => fetchWithAuth('/clients'),
  getClient: (id: string) => fetchWithAuth(`/clients/${id}`),
  createClient: (clientData: any) => fetchWithAuth('/clients', { method: 'POST', body: JSON.stringify(clientData) }),
  updateClient: (id: string, clientData: any) => fetchWithAuth(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(clientData) }),
  deleteClient: (id: string) => fetchWithAuth(`/clients/${id}`, { method: 'DELETE' }),
};

// API para Pets
export const petApi = {
  getPets: () => fetchWithAuth('/pets'),
  getPet: (id: string) => fetchWithAuth(`/pets/${id}`),
  createPet: (petData: any) => fetchWithAuth('/pets', { method: 'POST', body: JSON.stringify(petData) }),
  updatePet: (id: string, petData: any) => fetchWithAuth(`/pets/${id}`, { method: 'PATCH', body: JSON.stringify(petData) }),
  deletePet: (id: string) => fetchWithAuth(`/pets/${id}`, { method: 'DELETE' }),
};

// API para Groomers
export const groomerApi = {
  getGroomers: () => fetchWithAuth('/groomers'),
  getGroomer: (id: string) => fetchWithAuth(`/groomers/${id}`),
  createGroomer: (groomerData: any) => fetchWithAuth('/groomers', { method: 'POST', body: JSON.stringify(groomerData) }),
  updateGroomer: (id: string, groomerData: any) => fetchWithAuth(`/groomers/${id}`, { method: 'PATCH', body: JSON.stringify(groomerData) }),
  deleteGroomer: (id: string) => fetchWithAuth(`/groomers/${id}`, { method: 'DELETE' }),
};

// API para Pacotes
export const packageApi = {
  getPackages: () => fetchWithAuth('/packages'),
  getPackage: (id: string) => fetchWithAuth(`/packages/${id}`),
  createPackage: (packageData: any) => fetchWithAuth('/packages', { method: 'POST', body: JSON.stringify(packageData) }),
  updatePackage: (id: string, packageData: any) => fetchWithAuth(`/packages/${id}`, { method: 'PATCH', body: JSON.stringify(packageData) }),
  deletePackage: (id: string) => fetchWithAuth(`/packages/${id}`, { method: 'DELETE' }),
};

// API para Agendamentos
export const appointmentApi = {
  getAppointments: () => fetchWithAuth('/appointments'),
  getAppointment: (id: string) => fetchWithAuth(`/appointments/${id}`),
  createAppointment: (appointmentData: any) => fetchWithAuth('/appointments', { method: 'POST', body: JSON.stringify(appointmentData) }),
  updateAppointment: (id: string, appointmentData: any) => fetchWithAuth(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(appointmentData) }),
  deleteAppointment: (id: string) => fetchWithAuth(`/appointments/${id}`, { method: 'DELETE' }),
};
