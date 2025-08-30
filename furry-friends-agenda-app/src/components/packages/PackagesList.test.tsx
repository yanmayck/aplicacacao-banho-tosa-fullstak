import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PackagesList from './PackagesList';
import { usePackages } from '@/context/packages/PackageContext';
import { AuthContext, useAuth } from '@/context/AuthContext';

// Mocking hooks
vi.mock('@/context/packages/PackageContext');
vi.mock('@/context/AuthContext');

// Mock PackageForm component
vi.mock('./PackageForm', () => ({
  default: ({ onClose }) => (
    <div data-testid="package-form">
      <h2>Package Form</h2>
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));

const queryClient = new QueryClient();

const mockPackages = [
  { id: 'p1', name: 'Basic Pack', description: 'Just a bath', includesBaths: 4, includesGrooming: false, includesHydration: false, basePrice: 100, pickupPrice: 120 },
  { id: 'p2', name: 'Full Pack', description: 'Bath and grooming', includesBaths: 4, includesGrooming: true, includesHydration: true, basePrice: 180, pickupPrice: 200 },
];

describe('PackagesList Component', () => {
  let mockDeletePackage;
  let authValue;

  const setupMocks = (isAdmin = false) => {
    mockDeletePackage = vi.fn();
    
    authValue = {
        user: { email: 'test@test.com', role: isAdmin ? 'admin' : 'user' },
        logout: vi.fn(),
        isAdmin: () => isAdmin,
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
    };

    vi.mocked(usePackages).mockReturnValue({
      packages: mockPackages,
      isLoading: false,
      error: null,
      deletePackage: mockDeletePackage,
      addPackage: vi.fn(),
      updatePackage: vi.fn(),
      getPackageById: (id) => mockPackages.find(p => p.id === id),
    });

    vi.mocked(useAuth).mockReturnValue(authValue);
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue}>
            <MemoryRouter>
            <PackagesList />
            </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };

  describe('for non-admin users', () => {
    beforeEach(() => setupMocks(false));

    it('should render the list of packages without admin buttons', () => {
      renderComponent();
      expect(screen.getByText('Basic Pack')).toBeInTheDocument();
      expect(screen.getByText('Full Pack')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /novo pacote/i })).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Editar/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Excluir/i)).not.toBeInTheDocument();
    });
  });

  describe('for admin users', () => {
    beforeEach(() => setupMocks(true));

    it('should render admin-specific buttons', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: /novo pacote/i })).toBeInTheDocument();
      
      const editButtons = screen.getAllByLabelText(/Editar/i);
      const deleteButtons = screen.getAllByLabelText(/Excluir/i);

      expect(editButtons.length).toBe(mockPackages.length);
      expect(deleteButtons.length).toBe(mockPackages.length);
    });

    it('should open the form when "Novo Pacote" is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByRole('button', { name: /novo pacote/i }));
        expect(screen.getByTestId('package-form')).toBeInTheDocument();
    });

    it('should call deletePackage when delete button is clicked and confirmed', () => {
        window.confirm = vi.fn(() => true);
        renderComponent();
        const deleteButton = screen.getByLabelText(/Excluir Basic Pack/i);
        fireEvent.click(deleteButton);
        expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este pacote?');
        expect(mockDeletePackage).toHaveBeenCalledWith('p1');
    });
  });
});
