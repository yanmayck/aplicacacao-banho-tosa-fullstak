import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import { AuthContext, AuthContextType } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import * as useToast from '@/components/ui/use-toast';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    const authValue: AuthContextType = {
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      isAdmin: vi.fn().mockReturnValue(false),
    };

    return render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <Toaster />
          {ui}
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders the register form', () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('calls register function on form submit with valid data', async () => {
    mockRegister.mockResolvedValue(true);
    renderWithProviders(<Register />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await vi.waitFor(() => {
        expect(mockRegister).toHaveBeenCalledTimes(1);
        expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
  });

  it('shows a success toast and navigates on successful registration', async () => {
    const toastSpy = vi.spyOn(useToast, 'toast');
    mockRegister.mockResolvedValue(true);
    renderWithProviders(<Register />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await vi.waitFor(() => {
        expect(toastSpy).toHaveBeenCalledWith({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso! Você será redirecionado para o login.',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows an error toast if registration fails', async () => {
    const toastSpy = vi.spyOn(useToast, 'toast');
    mockRegister.mockResolvedValue(false);
    renderWithProviders(<Register />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await vi.waitFor(() => {
        expect(toastSpy).toHaveBeenCalledWith({
            title: 'Erro de cadastro',
            description: 'Não foi possível realizar o cadastro. Verifique os dados ou tente novamente mais tarde.',
            variant: 'destructive',
        });
    });
  });

  it('shows a toast message if fields are empty', async () => {
    const toastSpy = vi.spyOn(useToast, 'toast');
    renderWithProviders(<Register />);

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await vi.waitFor(() => {
        expect(toastSpy).toHaveBeenCalledWith({
            title: 'Erro',
            description: 'Por favor, preencha todos os campos.',
            variant: 'destructive',
        });
    });
  });
});
