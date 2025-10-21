import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PetsList from './PetsList';
import { usePets } from '@/context/pets/PetContext';
import { useClients } from '@/context/clients/ClientContext';
import { AuthContext, useAuth } from '@/context/AuthContext';

// Mocking hooks
vi.mock('@/context/pets/PetContext');
vi.mock('@/context/clients/ClientContext');
vi.mock('@/context/AuthContext');


// Mock PetForm component
vi.mock('./PetForm', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="pet-form">
      <h2>Pet Form</h2>
      <button onClick={onClose}>Close Form</button>
    </div>
  ),
}));

const queryClient = new QueryClient();

const mockPets = [
  {
    id: '1',
    name: 'Fido',
    species: 'Dog',
    clientId: 'c1',
    rabiesVaccine: { isUpToDate: true, lastDate: '2023-10-01' },
    vaccineHistory: []
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    clientId: 'c2',
    rabiesVaccine: { isUpToDate: false, lastDate: '2022-01-01' },
    vaccineHistory: []
  },
];

const mockClients = [
  { id: 'c1', name: 'John Doe', phone: '(11) 99999-9999', email: 'john@example.com', address: 'Rua A, 123' },
  { id: 'c2', name: 'Jane Smith', phone: '(11) 88888-8888', email: 'jane@example.com', address: 'Rua B, 456' },
];

const mockAuth = {
    user: { id: '1', email: 'test@test.com', name: 'Test User', role: 'user' as const },
    logout: vi.fn(),
    isAdmin: () => false,
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
};

describe('PetsList Component', () => {
  let mockDeletePet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeletePet = vi.fn();

    vi.mocked(usePets).mockReturnValue({
      pets: mockPets,
      isLoading: false,
      error: null,
      deletePet: mockDeletePet,
      getPetsByClientId: (clientId) => mockPets.filter(p => p.clientId === clientId),
      addPet: vi.fn(),
      updatePet: vi.fn(),
      getPetById: (id) => mockPets.find(p => p.id === id),
    });

    vi.mocked(useClients).mockReturnValue({
      clients: mockClients,
      isLoading: false,
      error: null,
      addClient: vi.fn(),
      updateClient: vi.fn(),
      deleteClient: vi.fn(),
      getClientById: (id) => mockClients.find(c => c.id === id),
    });

    vi.mocked(useAuth).mockReturnValue(mockAuth);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuth}>
            <MemoryRouter>
                <PetsList />
            </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };

  it('should render a list of pets with their owner\'s name', () => {
    renderComponent();
    expect(screen.getByText('Fido')).toBeInTheDocument();
    expect(screen.getByText(/Tutor: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.getByText(/Tutor: Jane Smith/i)).toBeInTheDocument();
  });

  it('should filter pets by search query', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText('Buscar pets...');
    fireEvent.change(searchInput, { target: { value: 'Fido' } });
    expect(screen.getByText('Fido')).toBeInTheDocument();
    expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
  });

  it('should show the PetForm when "Novo Pet" is clicked', () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: /novo pet/i });
    fireEvent.click(addButton);
    expect(screen.getByTestId('pet-form')).toBeInTheDocument();
  });

  it('should call deletePet when delete button is clicked and confirmed', () => {
    window.confirm = vi.fn(() => true); // Mock window.confirm
    renderComponent();
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.innerHTML.includes('lucide-trash-2'));
    expect(deleteButtons).toHaveLength(2); // Should have 2 delete buttons for 2 pets
    fireEvent.click(deleteButtons[0]!);
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este pet?');
    expect(mockDeletePet).toHaveBeenCalledWith('1');
  });

  it('should display a warning for pets with expired vaccines', () => {
    renderComponent();
    expect(screen.getByText(/vacina contra raiva vencida/i)).toBeInTheDocument();
  });
});
