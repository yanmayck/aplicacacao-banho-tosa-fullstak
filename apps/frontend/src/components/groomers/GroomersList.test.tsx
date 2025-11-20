import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GroomersList from './GroomersList';
import { useGroomers } from '@/context/groomers/GroomerContext';
import { AuthContext, useAuth, AuthContextType } from '@/context/AuthContext';
import { useStore, StoreContextType } from '@/context/StoreContext';
import { Groomer } from '@/context/StoreContext';

// Mocking hooks
vi.mock('@/context/groomers/GroomerContext');
vi.mock('@/context/AuthContext');
vi.mock('@/context/StoreContext');

// Mock GroomerForm component
vi.mock('./GroomerForm', () => ({
  default: ({ onClose, showStatusOnly }: { onClose: () => void; showStatusOnly?: boolean }) => (
    <div data-testid="groomer-form">
      <h2>{showStatusOnly ? 'Status Form' : 'Groomer Form'}</h2>
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));

const queryClient = new QueryClient();

const mockGroomers: Groomer[] = [
  { id: 'g1', name: 'Alice', status: 'available' as const, commissionPercentage: 25 },
  { id: 'g2', name: 'Bob', status: 'busy' as const, commissionPercentage: 30 },
];

describe('GroomersList Component', () => {
  let mockDeleteGroomer: (id: string) => void;
  let authValue: AuthContextType;

  const setupMocks = (isAdmin = false) => {
    mockDeleteGroomer = vi.fn();

    authValue = {
      user: { id: '1', email: 'test@test.com', name: 'Test User', role: isAdmin ? 'admin' as const : 'user' as const },
      logout: vi.fn(),
      isAdmin: () => isAdmin,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
    };

    vi.mocked(useGroomers).mockReturnValue({
      groomers: mockGroomers,
      isLoading: false,
      error: null,
      deleteGroomer: mockDeleteGroomer,
      addGroomer: vi.fn(),
      updateGroomer: vi.fn(),
      getGroomerById: (id) => mockGroomers.find(g => g.id === id),
    });

    vi.mocked(useAuth).mockReturnValue(authValue);

    vi.mocked(useStore).mockReturnValue({
      getGroomerWorkload: vi.fn().mockReturnValue(5),
      getGroomerMonthlyPoints: vi.fn().mockReturnValue(10),
      clients: [],
      pets: [],
      groomers: [],
      appointments: [],
      commissions: [],
      packages: [],
      groomerPoints: [],
      addClient: vi.fn(),
      updateClient: vi.fn(),
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
      addPackage: vi.fn(),
      updatePackage: vi.fn(),
      deletePackage: vi.fn(),
      getClientById: vi.fn(),
      getPetById: vi.fn(),
      getGroomerById: vi.fn(),
      getAppointmentById: vi.fn(),
      getPackageById: vi.fn(),
      getCommissionsByGroomerId: vi.fn(),
      getTotalCommissionsByGroomerId: vi.fn(),
      getGroomerPointsByMonth: vi.fn(),
      updateAppointmentPoints: vi.fn(),
      autoAssignGroomer: vi.fn(),
      isLoading: false,
      error: null,
    } as StoreContextType);
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue}>
          <MemoryRouter>
            <GroomersList />
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };

  describe('for non-admin users', () => {
    beforeEach(() => setupMocks(false));

    it('should render the list of groomers without admin buttons', () => {
      renderComponent();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Disponível')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Ocupado')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /novo tosador/i })).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Editar/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Excluir/i)).not.toBeInTheDocument();
    });

    it('should open the status form when "Alterar Status" is clicked', () => {
      renderComponent();
      const changeStatusButtons = screen.getAllByRole('button', { name: /alterar status/i });
      expect(changeStatusButtons.length).toBeGreaterThan(0);
      if (changeStatusButtons[0]) {
        fireEvent.click(changeStatusButtons[0]);
      }
      expect(screen.getByTestId('groomer-form')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /status form/i })).toBeInTheDocument();
    });
  });

  describe('for admin users', () => {
    beforeEach(() => setupMocks(true));

    it('should render admin-specific buttons', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: /novo tosador/i })).toBeInTheDocument();

      const editButtons = screen.getAllByLabelText(/Editar/i);
      const deleteButtons = screen.getAllByLabelText(/Excluir/i);

      expect(editButtons.length).toBe(mockGroomers.length);
      expect(deleteButtons.length).toBe(mockGroomers.length);
    });

    it('should open the main form when "Novo Tosador" is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /novo tosador/i }));
      expect(screen.getByTestId('groomer-form')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /groomer form/i })).toBeInTheDocument();
    });

    it('should call deleteGroomer when delete button is clicked and confirmed', () => {
      window.confirm = vi.fn(() => true);
      renderComponent();
      const deleteButton = screen.getByLabelText(/Excluir Alice/i);
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este tosador?');
      expect(mockDeleteGroomer).toHaveBeenCalledWith('g1');
    });
  });
});
