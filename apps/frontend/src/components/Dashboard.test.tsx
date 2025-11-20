import { render, screen, within } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import Dashboard from './Dashboard';
import { StoreContext } from '@/context/StoreContext';
import { AuthContext } from '@/context/AuthContext';
import { User, UserRole } from '@/context/AuthContext';
import { Appointment, AppointmentStatus } from '@/context/StoreContext';

interface MockStore {
  appointments: Appointment[];
  groomers: never[];
  clients: never[];
  pets: never[];
  commissions: never[];
  packages: never[];
  groomerPoints: never[];
  addClient: () => void;
  updateClient: () => void;
  deleteClient: () => void;
  addPet: () => void;
  updatePet: () => void;
  deletePet: () => void;
  addAppointment: () => void;
  updateAppointment: () => void;
  deleteAppointment: () => void;
  addGroomer: () => void;
  updateGroomer: () => void;
  deleteGroomer: () => void;
  addCommission: () => void;
  updateCommission: () => void;
  deleteCommission: () => void;
  addPackage: () => void;
  updatePackage: () => void;
  deletePackage: () => void;
  addGroomerPoint: () => void;
  updateGroomerPoint: () => void;
  deleteGroomerPoint: () => void;
  getClientById: () => undefined;
  getPetById: () => undefined;
  getGroomerById: () => undefined;
  getAppointmentById: () => undefined;
  getPackageById: () => undefined;
  getCommissionsByGroomerId: (groomerId: string) => never[];
  getTotalCommissionsByGroomerId: (groomerId: string, month?: number, year?: number) => number;
  getGroomerWorkload: (groomerId: string, onlyCompletedAppointments?: boolean) => number;
  getGroomerMonthlyPoints: (groomerId: string, month?: number, year?: number) => number;
  getGroomerPointsByMonth: (month: number, year: number) => never[];
  addGroomerPoints: (groomerId: string, points: number, appointmentId: string) => void;
  updateAppointmentPoints: (appointmentId: string, points: number) => void;
  getPetsByClientId?: (clientId: string) => never[];
  autoAssignGroomer?: (appointmentId: string) => void;
  isLoading: boolean;
  error: null;
}

interface MockUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

interface MockAuth {
  user: MockUser | null;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
  login: () => Promise<boolean>;
  register: () => Promise<boolean>;
  logout: () => void;
}

const mockStore: MockStore = {
  appointments: [],
  groomers: [],
  clients: [],
  pets: [],
  commissions: [],
  packages: [],
  groomerPoints: [],
  addClient: () => {},
  updateClient: () => {},
  deleteClient: () => {},
  addPet: () => {},
  updatePet: () => {},
  deletePet: () => {},
  addAppointment: () => {},
  updateAppointment: () => {},
  deleteAppointment: () => {},
  addGroomer: () => {},
  updateGroomer: () => {},
  deleteGroomer: () => {},
  addCommission: () => {},
  updateCommission: () => {},
  deleteCommission: () => {},
  addPackage: () => {},
  updatePackage: () => {},
  deletePackage: () => {},
  addGroomerPoint: () => {},
  updateGroomerPoint: () => {},
  deleteGroomerPoint: () => {},
  getClientById: () => undefined,
  getPetById: () => undefined,
  getGroomerById: () => undefined,
  getAppointmentById: () => undefined,
  getPackageById: () => undefined,
  getCommissionsByGroomerId: () => [],
  getTotalCommissionsByGroomerId: () => 0,
  getGroomerWorkload: () => 0,
  getGroomerMonthlyPoints: () => 0,
  getGroomerPointsByMonth: () => [],
  addGroomerPoints: () => {},
  updateAppointmentPoints: () => {},
  getPetsByClientId: () => [],
  autoAssignGroomer: () => {},
  isLoading: false,
  error: null,
};

const mockAuth: MockAuth = {
  user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' },
  isAdmin: () => true,
  isAuthenticated: true,
  login: () => Promise.resolve(true),
  register: () => Promise.resolve(true),
  logout: () => {},
};

describe('Dashboard', () => {
  const renderWithProviders = (store: MockStore, auth: MockAuth) => {
    return render(
      <AuthContext.Provider value={auth}>
        <StoreContext.Provider value={store}>
          <Dashboard />
        </StoreContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('renders the dashboard with correct data', () => {
    renderWithProviders(mockStore, mockAuth);

    const welcomeText = screen.getByText(/bem-vindo, test user/i);
    expect(welcomeText).toBeTruthy();

    const clientsCard = screen.getAllByText(/clientes/i).find(e => e.tagName === 'SPAN')?.closest('.p-4');
    expect(clientsCard).toBeTruthy();

    const countElement = within(clientsCard as HTMLElement).getByText('0');
    expect(countElement).toBeTruthy();
  });

  it('displays correct counts for appointments', () => {
   const appointments: Appointment[] = [
     { id: '1', status: 'waiting' as AppointmentStatus, clientId: '1', groomerId: '1', serviceType: 'bath', date: '2024-01-01', time: '10:00', price: 50, petName: 'Rex' },
     { id: '2', status: 'progress' as AppointmentStatus, clientId: '1', groomerId: '1', serviceType: 'grooming', date: '2024-01-01', time: '11:00', price: 60, petName: 'Rex' },
     { id: '3', status: 'completed' as AppointmentStatus, clientId: '1', groomerId: '1', serviceType: 'both', date: '2024-01-01', time: '12:00', price: 80, petName: 'Rex' },
     { id: '4', status: 'waiting' as AppointmentStatus, clientId: '1', groomerId: '1', serviceType: 'bath', date: '2024-01-01', time: '13:00', price: 50, petName: 'Rex' },
   ];
   renderWithProviders({ ...mockStore, appointments }, mockAuth);

    const waitingCard = screen.getByText(/em espera/i).closest('.p-4');
    expect(waitingCard).toBeTruthy();

    const waitingCount = within(waitingCard as HTMLElement).getByText('2');
    expect(waitingCount).toBeTruthy();

    const progressCard = screen.getByText(/em andamento/i).closest('.p-4');
    expect(progressCard).toBeTruthy();

    const progressCount = within(progressCard as HTMLElement).getByText('1');
    expect(progressCount).toBeTruthy();
  });

  it('shows admin-only commission card', () => {
    renderWithProviders(mockStore, { ...mockAuth, isAdmin: () => true });
    const commissionText = screen.getByText(/comissões \(mês\)/i);
    expect(commissionText).toBeTruthy();
  });

  it('hides admin-only commission card for non-admins', () => {
    renderWithProviders(mockStore, { ...mockAuth, isAdmin: () => false });
    const commissionText = screen.queryByText(/comissões \(mês\)/i);
    expect(commissionText).toBeNull();
  });
});
