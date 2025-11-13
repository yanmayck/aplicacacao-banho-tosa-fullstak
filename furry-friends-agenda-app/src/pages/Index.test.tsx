import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import { AuthContext, AuthContextType } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock child components and contexts
vi.mock('@/components/Layout', () => ({
  Layout: ({ children, activePage }: { children: React.ReactNode; activePage: string }) => (
    <div data-testid="layout">
      <div data-testid="active-page">{activePage}</div>
      {children}
    </div>
  ),
}));

vi.mock('@/components/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard Content</div>,
}));

const mockAuth: AuthContextType = {
  user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  isAdmin: () => true,
  isAuthenticated: true,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

const queryClient = new QueryClient();

describe('Index Page', () => {
  it('renders the Layout and Dashboard components', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={mockAuth}>
              <StoreProvider>
                  <Dashboard />
              </StoreProvider>
            </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Check if Layout and Dashboard are rendered
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();

    // Check if the active page is correctly set to 'dashboard'
    expect(screen.getByTestId('active-page')).toHaveTextContent('dashboard');
  });
});