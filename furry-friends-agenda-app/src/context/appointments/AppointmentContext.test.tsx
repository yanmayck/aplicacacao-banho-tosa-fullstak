
import React from 'react';
import { render } from '@testing-library/react';
import { AppointmentProvider } from './AppointmentContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useQueryClient: vi.fn(),
    useMutation: vi.fn(() => ({ mutateAsync: vi.fn() })),
  };
});

describe('AppointmentContext', () => {
  it('should use staleTime of 5 minutes for appointments query', () => {
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    (useQueryClient as any).mockReturnValue({
        invalidateQueries: vi.fn(),
    });

    render(
      <AppointmentProvider>
        <div>Test</div>
      </AppointmentProvider>
    );

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['appointments'],
      staleTime: 5 * 60 * 1000,
    }));
  });
});
