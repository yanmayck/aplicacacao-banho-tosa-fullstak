import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientForm from './ClientForm';
import { StoreContext, Client } from '@/context/StoreContext';
import { AuthContext } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Mock a toast function
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

const mockAddClient = vi.fn();
const mockUpdateClient = vi.fn();
const mockOnClose = vi.fn();

const renderWithProviders = (ui: React.ReactElement, { isAdmin = true, client = undefined } = {}) => {
  const storeValue = {
    clients: [],
    pets: [],
    groomers: [],
    appointments: [],
    commissions: [],
    packages: [],
    groomerPoints: [],
    addClient: mockAddClient,
    updateClient: mockUpdateClient,
    deleteClient: vi.fn(),
    addPet: vi.fn(),
    updatePet: vi.fn(),
    deletePet: vi.fn(),
    addGroomer: vi.fn(),
    updateGroomer: vi.fn(),
    deleteGroomer: vi.fn(),
    addAppointment: vi.fn(),
    updateAppointment: vi.fn(),
    deleteAppointment: vi.fn(),
    addCommission: vi.fn(),
    updateCommission: vi.fn(),
    deleteCommission: vi.fn(),
    addPackage: vi.fn(),
    updatePackage: vi.fn(),
    deletePackage: vi.fn(),
    addGroomerPoint: vi.fn(),
    updateGroomerPoint: vi.fn(),
    deleteGroomerPoint: vi.fn(),
    getClientById: vi.fn(),
    getPetById: vi.fn(),
    getGroomerById: vi.fn(),
    getAppointmentById: vi.fn(),
    getPackageById: vi.fn(),
    getCommissionsByGroomerId: vi.fn(),
    getTotalCommissionsByGroomerId: vi.fn(),
    getGroomerWorkload: vi.fn(),
    getGroomerMonthlyPoints: vi.fn(),
    getGroomerPointsByMonth: vi.fn(),
    addGroomerPoints: vi.fn(),
    updateAppointmentPoints: vi.fn(),
    autoAssignGroomer: vi.fn(),
    isLoading: false,
    error: null,
  };
  const authValue = {
    user: { id: '1', email: 'test@test.com', name: 'Test User', role: 'admin' as const },
    isAdmin: () => isAdmin,
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <StoreContext.Provider value={storeValue}>
        <Toaster />
        {ui}
      </StoreContext.Provider>
    </AuthContext.Provider>
  );
};

describe('ClientForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form for creating a new client', () => {
    renderWithProviders(<ClientForm onClose={mockOnClose} />);
    expect(screen.getByRole('heading', { name: /novo cliente/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do tutor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('renders the form for editing an existing client', () => {
    const mockClient: Client = { id: '1', name: 'Jane Doe', phone: '0987654321', email: 'jane@test.com', address: '456 Other St' };
    renderWithProviders(<ClientForm client={mockClient} onClose={mockOnClose} />);
    
    expect(screen.getByRole('heading', { name: /editar cliente/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atualizar/i })).toBeInTheDocument();
  });

  it('calls addClient on submit when creating a new client with valid data', async () => {
    renderWithProviders(<ClientForm onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByLabelText(/nome do tutor/i), { target: { value: 'New Client' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '1122334455' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(mockAddClient).toHaveBeenCalledTimes(1);
    expect(mockAddClient).toHaveBeenCalledWith({ 
      name: 'New Client', 
      phone: '1122334455', 
      email: '', 
      address: '' 
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls updateClient on submit when editing a client', async () => {
    const mockClient: Client = { id: '1', name: 'Jane Doe', phone: '0987654321', email: 'jane@test.com', address: '456 Other St' };
    renderWithProviders(<ClientForm client={mockClient} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/nome do tutor/i), { target: { value: 'Jane Doe Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    expect(mockUpdateClient).toHaveBeenCalledTimes(1);
    expect(mockUpdateClient).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe Updated' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows permission denied message if user is not an admin', () => {
    renderWithProviders(<ClientForm onClose={mockOnClose} />, { isAdmin: false });
    expect(screen.getByText(/permissão negada/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cadastrar/i })).not.toBeInTheDocument();
  });
});
