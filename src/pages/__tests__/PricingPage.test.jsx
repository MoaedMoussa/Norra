import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from '../../pages/PricingPage';
import { vi } from 'vitest';

// Mock context and hooks
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null, // Initially not logged in
    updatePlan: vi.fn(),
    cancelSubscription: vi.fn(),
  }))
}));

vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('PricingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pricing plans correctly', () => {
    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    // Check plan headers
    expect(screen.getAllByText('Hobby').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Standard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unlimited').length).toBeGreaterThan(0);
    
    // Check billing toggle text
    expect(screen.getAllByText(/Monthly Billing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Annual Billing/i).length).toBeGreaterThan(0);
  });

  it('toggles billing cycle between monthly and annually', async () => {
    const { container } = render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    
    // Find the toggle button
    const toggleButton = container.querySelector('button.w-12.h-6');
    expect(toggleButton).toBeInTheDocument();
    
    // Switch to Annual
    await user.click(toggleButton);
    
    // Pricing page should reflect yearly billing state
    // $159/mo billed yearly vs $199/mo billed monthly for the Unlimited plan
    expect(screen.getAllByText('$159').length).toBeGreaterThan(0);
  });
});
