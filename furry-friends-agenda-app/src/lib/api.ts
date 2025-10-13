import axios from 'axios';
import { Client, Pet, Groomer, Appointment, Package } from '@/context/models/types';

// 1. Cria uma instância do Axios com configurações globais
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333',
});

// 2. Adiciona um interceptor para injetar o token de autenticação em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('petshop-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Define tipos para os dados de criação/atualização para maior segurança
type CreateClientData = Omit<Client, 'id'>;
type UpdateClientData = Partial<CreateClientData>;

// API para Clientes com Axios e tipos
export const clientApi = {
  getClients: async (): Promise<Client[]> => {
    const { data } = await api.get('/clients');
    return data;
  },
  getClient: async (id: string): Promise<Client> => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },
  createClient: async (clientData: CreateClientData): Promise<Client> => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },
  updateClient: async (id: string, clientData: UpdateClientData): Promise<Client> => {
    const { data } = await api.patch(`/clients/${id}`, clientData);
    return data;
  },
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

// (Opcional) Você pode seguir o mesmo padrão para as outras APIs (Pet, Groomer, etc.)

// Exemplo para Pet API
type CreatePetData = Omit<Pet, 'id'>;
type UpdatePetData = Partial<CreatePetData>;

export const petApi = {
    getPets: async (): Promise<Pet[]> => {
        const { data } = await api.get('/pets');
        return data;
    },
    deletePet: async (id: string): Promise<void> => {
        await api.delete(`/pets/${id}`);
    },
    createPet: async (petData: CreatePetData): Promise<Pet> => {
        const { data } = await api.post('/pets', petData);
        return data;
    },
    updatePet: async (id: string, petData: UpdatePetData): Promise<Pet> => {
        const { data } = await api.patch(`/pets/${id}`, petData);
        return data;
    }
};

// Exemplo para Appointment API
type CreateAppointmentData = Omit<Appointment, 'id'>;
type UpdateAppointmentData = Partial<CreateAppointmentData>;

export const appointmentApi = {
    getAppointments: async (): Promise<Appointment[]> => {
        const { data } = await api.get('/appointments');
        return data;
    },
    deleteAppointment: async (id: string): Promise<void> => {
        await api.delete(`/appointments/${id}`);
    },
    createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
        const { data } = await api.post('/appointments', appointmentData);
        return data;
    },
    updateAppointment: async (id: string, appointmentData: UpdateAppointmentData): Promise<Appointment> => {
        const { data } = await api.patch(`/appointments/${id}`, appointmentData);
        return data;
    }
};

// Exemplo para Groomer API
type CreateGroomerData = Omit<Groomer, 'id'>;
type UpdateGroomerData = Partial<CreateGroomerData>;

export const groomerApi = {
    getGroomers: async (): Promise<Groomer[]> => {
        const { data } = await api.get('/groomers');
        return data;
    },
    deleteGroomer: async (id: string): Promise<void> => {
        await api.delete(`/groomers/${id}`);
    },
    createGroomer: async (groomerData: CreateGroomerData): Promise<Groomer> => {
        const { data } = await api.post('/groomers', groomerData);
        return data;
    },
    updateGroomer: async (id: string, groomerData: UpdateGroomerData): Promise<Groomer> => {
        const { data } = await api.patch(`/groomers/${id}`, groomerData);
        return data;
    }
};

// Exemplo para Package API
type CreatePackageData = Omit<Package, 'id'>;
type UpdatePackageData = Partial<CreatePackageData>;

export const packageApi = {
    getPackages: async (): Promise<Package[]> => {
        const { data } = await api.get('/packages');
        return data;
    },
    deletePackage: async (id: string): Promise<void> => {
        await api.delete(`/packages/${id}`);
    },
    createPackage: async (packageData: CreatePackageData): Promise<Package> => {
        const { data } = await api.post('/packages', packageData);
        return data;
    },
    updatePackage: async (id: string, packageData: UpdatePackageData): Promise<Package> => {
        const { data } = await api.patch(`/packages/${id}`, packageData);
        return data;
    }
};