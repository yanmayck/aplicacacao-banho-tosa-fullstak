/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { AuthContext } from '@/context/AuthContext';

const mockLogout = vi.fn();
const mockSetActivePage = vi.fn();

const renderWithProviders = (isAdmin = false) => {
  const authValue = {
    user: { id: '1', email: 'test@test.com', role: isAdmin ? 'admin' : 'user' },
    logout: mockLogout,
    isAdmin: () => isAdmin,
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue as any}>
        <Layout activePage="dashboard" setActivePage={mockSetActivePage}>
          <div>Child Content</div>
        </Layout>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Layout Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

  it('renders all standard menu items', () => {
    renderWithProviders();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Banho e Tosa')).toBeInTheDocument();
    expect(screen.getByText('Tosadores')).toBeInTheDocument();
    expect(screen.getByText('Pacotes')).toBeInTheDocument();
  });

  it('does not render "Relatórios" for non-admin users', () => {
    renderWithProviders(false);
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
  });

  it('renders "Relatórios" for admin users', () => {
    renderWithProviders(true);
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('calls setActivePage when a menu item is clicked', () => {
    renderWithProviders();
    fireEvent.click(screen.getByText('Clientes'));
    expect(mockSetActivePage).toHaveBeenCalledWith('clients');
  });

  it('calls logout when the "Sair" button is clicked', () => {
    renderWithProviders();
    const logoutButtons = screen.getAllByRole('button', { name: /sair/i });
    expect(logoutButtons).toHaveLength(1);

    // Ensure the first button exists before clicking
    const logoutButton = logoutButtons[0];
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toBeDefined();

    fireEvent.click(logoutButton!);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('displays the user email', () => {
    renderWithProviders();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
  });
});
