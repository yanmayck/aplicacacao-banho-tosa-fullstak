import { render, screen, within } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import Dashboard from './Dashboard';
import { StoreContext } from '@/context/StoreContext';
import { AuthContext } from '@/context/AuthContext';

interface MockAppointment {
  status: string;
}

interface MockStore {
  appointments: MockAppointment[];
  groomers: unknown[];
  clients: unknown[];
  pets: unknown[];
  commissions: unknown[];
  packages: unknown[];
  groomerPoints: unknown[];
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
  getClientById: () => unknown;
  getPetById: () => unknown;
  getGroomerById: () => unknown;
  getAppointmentById: () => unknown;
  getPackageById: () => unknown;
  isLoading: boolean;
  error: unknown;
}

interface MockUser {
  username: string;
  role: string;
}

interface MockAuth {
  user: MockUser;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
  login: () => void;
  register: () => void;
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
  getClientById: () => ({}),
  getPetById: () => ({}),
  getGroomerById: () => ({}),
  getAppointmentById: () => ({}),
  getPackageById: () => ({}),
  isLoading: false,
  error: null,
};

const mockAuth: MockAuth = {
  user: { username: 'Test User', role: 'admin' },
  isAdmin: () => true,
  isAuthenticated: true,
  login: () => {},
  register: () => {},
  logout: () => {},
};

describe('Dashboard', () => {
  const renderWithProviders = (store: typeof mockStore, auth: typeof mockAuth) => {
    return render(
      <AuthContext.Provider value={auth as any}>
        <StoreContext.Provider value={store as any}>
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
    const appointments: MockAppointment[] = [
      { status: 'waiting' },
      { status: 'progress' },
      { status: 'completed' },
      { status: 'waiting' },
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
