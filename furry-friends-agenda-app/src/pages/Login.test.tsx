import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { AuthContext, AuthContextType } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { MemoryRouter } from 'react-router-dom';
import * as useToast from '@/components/ui/use-toast';

const mockLogin = vi.fn();

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    const authValue: AuthContextType = {
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      register: vi.fn(),
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

  it('renders the login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('heading', { name: /petshop manager/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('calls login function on form submit with valid data', () => {
    mockLogin.mockResolvedValue(true);
    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows a toast message if login fails', async () => {
    const toastSpy = vi.spyOn(useToast, 'toast');
    mockLogin.mockResolvedValue(false);
    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await vi.waitFor(() => {
        expect(toastSpy).toHaveBeenCalledWith({
            title: 'Erro de autenticação',
            description: 'Usuário ou senha incorretos.',
            variant: 'destructive',
        });
    });
  });

  it('shows a toast message if fields are empty', () => {
    const toastSpy = vi.spyOn(useToast, 'toast');
    renderWithProviders(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(toastSpy).toHaveBeenCalledWith({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
    });
  });
});
