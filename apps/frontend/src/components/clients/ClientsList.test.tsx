
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ClientsList from './ClientsList';
import { useClients } from '@/context/clients/ClientContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { toast } from "@/components/ui/use-toast";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

// Mock child components
vi.mock('./ClientForm', () => ({
  default: ({ client, onClose }) => (
    <div data-testid="client-form">
      <h2>Client Form</h2>
      <button onClick={onClose}>Close Form</button>
      {client && <p>Editing: {client.name}</p>}
    </div>
  ),
}));

vi.mock('../pets/PetForm', () => ({
    default: ({ clientId, onClose }) => (
      <div data-testid="pet-form">
        <h2>Pet Form</h2>
        <p>Client ID: {clientId}</p>
        <button onClick={onClose}>Close Pet Form</button>
      </div>
    ),
}));

// Mock contexts
vi.mock('@/context/StoreContext');
vi.mock('@/context/AuthContext');
vi.mock('@/context/clients/ClientContext');
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));



const mockClients = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '987654321', address: '456 Oak Ave' },
];

describe('ClientsList', () => {
  let mockDeleteClient;
  let mockGetPetsByClientId;
  let mockIsAdmin;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteClient = vi.fn();
    mockGetPetsByClientId = vi.fn().mockReturnValue([]);
    mockIsAdmin = vi.fn().mockReturnValue(false);

    vi.mocked(useStore).mockReturnValue({
      deleteClient: mockDeleteClient,
      getPetsByClientId: mockGetPetsByClientId,
    });

    vi.mocked(useAuth).mockReturnValue({
      isAdmin: mockIsAdmin,
    });

    vi.mocked(useClients).mockReturnValue({
      clients: [],
      isLoading: false,
      error: null,
    });
  });

  it('should render loading spinner when loading', () => {
    vi.mocked(useClients).mockReturnValue({
      clients: [],
      isLoading: true,
      error: null,
    });
    renderWithRouter(<ClientsList />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render error message on error', () => {
    const error = new Error('Failed to fetch');
    vi.mocked(useClients).mockReturnValue({
      clients: [],
      isLoading: false,
      error: error,
    });
    renderWithRouter(<ClientsList />);
    expect(screen.getByText(/Erro ao carregar clientes/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
  });

  it('should render "Nenhum cliente cadastrado." when no clients are available', () => {
    renderWithRouter(<ClientsList />);
    expect(screen.getByText('Nenhum cliente cadastrado.')).toBeInTheDocument();
  });

  it('should render a list of clients', () => {
    vi.mocked(useClients).mockReturnValue({
      clients: mockClients,
      isLoading: false,
      error: null,
    });
    renderWithRouter(<ClientsList />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should filter clients based on search query', () => {
    vi.mocked(useClients).mockReturnValue({
      clients: mockClients,
      isLoading: false,
      error: null,
    });
    renderWithRouter(<ClientsList />);
    
    const searchInput = screen.getByPlaceholderText('Buscar clientes...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should show "Novo Cliente" button for admins', () => {
    mockIsAdmin.mockReturnValue(true);
    renderWithRouter(<ClientsList />);
    expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
  });

  it('should hide "Novo Cliente" button for non-admins', () => {
    renderWithRouter(<ClientsList />);
    expect(screen.queryByText('Novo Cliente')).not.toBeInTheDocument();
  });

  it('should show ClientForm when "Novo Cliente" is clicked by an admin', () => {
    mockIsAdmin.mockReturnValue(true);
    renderWithRouter(<ClientsList />);
    
    fireEvent.click(screen.getByText('Novo Cliente'));
    
    expect(screen.getByTestId('client-form')).toBeInTheDocument();
  });

  it('should show ClientForm in edit mode when edit button is clicked by an admin', () => {
    mockIsAdmin.mockReturnValue(true);
    vi.mocked(useClients).mockReturnValue({
        clients: mockClients,
        isLoading: false,
        error: null,
    });
    renderWithRouter(<ClientsList />);

    const editButton = screen.getAllByTestId('edit-button')[0];
    fireEvent.click(editButton);

    expect(screen.getByTestId('client-form')).toBeInTheDocument();
    expect(screen.getByText('Editing: John Doe')).toBeInTheDocument();
  });

  it('should not allow non-admin to edit a client', () => {
    vi.mocked(useClients).mockReturnValue({
        clients: mockClients,
        isLoading: false,
        error: null,
    });
    renderWithRouter(<ClientsList />);

    const editButton = screen.getAllByTestId('edit-button')[0];
    fireEvent.click(editButton);

    expect(toast).toHaveBeenCalledWith({
        title: "Permissão negada",
        description: "Apenas administradores podem editar clientes.",
        variant: "destructive"
    });
    expect(screen.queryByTestId('client-form')).not.toBeInTheDocument();
  });

  it('should call deleteClient when delete button is clicked by an admin', () => {
    mockIsAdmin.mockReturnValue(true);
    vi.mocked(useClients).mockReturnValue({
        clients: mockClients,
        isLoading: false,
        error: null,
    });
    window.confirm = vi.fn(() => true);
    renderWithRouter(<ClientsList />);

    const deleteButton = screen.getAllByTestId('delete-button')[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith("Tem certeza que deseja excluir este cliente?");
    expect(mockDeleteClient).toHaveBeenCalledWith('1');
  });

  it('should not allow non-admin to delete a client', () => {
    vi.mocked(useClients).mockReturnValue({
        clients: mockClients,
        isLoading: false,
        error: null,
    });
    renderWithRouter(<ClientsList />);

    const deleteButton = screen.getAllByTestId('delete-button')[0];
    fireEvent.click(deleteButton);

    expect(toast).toHaveBeenCalledWith({
        title: "Permissão negada",
        description: "Apenas administradores podem excluir clientes.",
        variant: "destructive"
    });
    expect(mockDeleteClient).not.toHaveBeenCalled();
  });

  it('should show PetForm when "Adicionar Pet" is clicked', () => {
    vi.mocked(useClients).mockReturnValue({
        clients: mockClients,
        isLoading: false,
        error: null,
    });
    renderWithRouter(<ClientsList />);

    const addPetButtons = screen.getAllByText('Adicionar Pet');
    fireEvent.click(addPetButtons[0]);

    expect(screen.getByTestId('pet-form')).toBeInTheDocument();
    expect(screen.getByText('Client ID: 1')).toBeInTheDocument();
  });
});
