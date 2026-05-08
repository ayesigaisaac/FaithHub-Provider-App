import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderOnboardingPage from './FH-P-001_ProviderOnboarding';
import { AuthContext } from '@/auth/AuthContext';
import type { ProviderOnboardingDraft } from '@/auth/types';

const draft: ProviderOnboardingDraft = {
  organizationName: 'FaithHub Church',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  organizationType: 'church',
  country: 'Uganda',
  city: 'Kampala',
  mission: '',
  website: '',
  primaryLanguage: 'English',
  agreedToTerms: false,
};

describe('Provider onboarding page', () => {
  it('jumps to resume step and allows reset', async () => {
    const user = userEvent.setup();
    const setOnboardingDraft = vi.fn();
    const setOnboardingStatus = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          user: { id: 'u1', name: 'Test', email: 'test@faithhub.dev' },
          role: 'leadership',
          workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
          permissions: [],
          routePermissions: {},
          actionPermissions: {},
          onboardingStatus: 'in_progress',
          onboardingDraft: draft,
          isOnboardingComplete: false,
          isAuthenticated: true,
          loading: false,
          login: async () => {},
          logout: async () => {},
          setWorkspace: () => {},
          setOnboardingDraft,
          setOnboardingStatus,
          canAccessPath: () => true,
          canPerform: () => true,
        }}
      >
        <MemoryRouter>
          <ProviderOnboardingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText(/Resume step: Contact/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Jump to resume step/i }));
    expect(screen.getByLabelText(/Primary contact name/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset draft/i }));
    expect(setOnboardingDraft).toHaveBeenCalled();
    expect(setOnboardingStatus).toHaveBeenCalledWith('not_started');
  });
});
