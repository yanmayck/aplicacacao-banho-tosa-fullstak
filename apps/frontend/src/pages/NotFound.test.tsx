import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound Page', () => {
  it('renders the 404 message and a link to home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Check for the 404 heading
    expect(screen.getByRole('heading', { level: 1, name: /404/i })).toBeInTheDocument();

    // Check for the "Page not found" message
    expect(screen.getByText(/oops! page not found/i)).toBeInTheDocument();

    // Check for the link back to the homepage
    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
