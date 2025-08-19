import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { StoreContext } from '@/context/StoreContext';
import { AuthContext } from '@/context/AuthContext';

const mockStore = {
  appointments: [],
  groomers: [],
  clients: [],
  pets: [],
  commissions: [],
};

const mockAuth = {
  user: { username: 'Test User', role: 'admin' },
  isAdmin: () => true,
};

describe('Dashboard', () => {
  const renderWithProviders = (store, auth) => {
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

    expect(screen.getByText(/bem-vindo, test user/i)).toBeInTheDocument();
    const clientsCard = screen.getAllByText(/clientes/i).find(e => e.tagName === 'SPAN').closest('.p-4');
    expect(within(clientsCard).getByText('0')).toBeInTheDocument();
  });

  it('displays correct counts for appointments', () => {
    const appointments = [
      { status: 'waiting' },
      { status: 'progress' },
      { status: 'completed' },
      { status: 'waiting' },
    ];
    renderWithProviders({ ...mockStore, appointments }, mockAuth);

    const waitingCard = screen.getByText(/em espera/i).closest('.p-4');
    expect(within(waitingCard).getByText('2')).toBeInTheDocument();
    const progressCard = screen.getByText(/em andamento/i).closest('.p-4');
    expect(within(progressCard).getByText('1')).toBeInTheDocument();
  });

  it('shows admin-only commission card', () => {
    renderWithProviders(mockStore, { ...mockAuth, isAdmin: () => true });
    expect(screen.getByText(/comissões \(mês\)/i)).toBeInTheDocument();
  });

  it('hides admin-only commission card for non-admins', () => {
    renderWithProviders(mockStore, { ...mockAuth, isAdmin: () => false });
    expect(screen.queryByText(/comissões \(mês\)/i)).not.toBeInTheDocument();
  });
});
