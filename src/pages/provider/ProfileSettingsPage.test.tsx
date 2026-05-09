import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileSettingsPage from './ProfileSettingsPage';
import { AuthContext } from '@/auth/AuthContext';

describe('ProfileSettingsPage', () => {
  it('saves workspace/profile updates and can reset', async () => {
    const user = userEvent.setup();
    const setWorkspace = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          user: { id: 'u1', name: 'Test User', email: 'test@faithhub.dev' },
          role: 'leadership',
          workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
          permissions: [],
          routePermissions: {},
          actionPermissions: {},
          onboardingStatus: 'approved',
          onboardingDraft: {
            organizationName: '',
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
          },
          isOnboardingComplete: true,
          isAuthenticated: true,
          loading: false,
          login: async () => {},
          logout: async () => {},
          setWorkspace,
          setOnboardingDraft: () => {},
          setOnboardingStatus: () => {},
          refreshOnboarding: async () => {},
          saveOnboardingDraft: async () => {},
          submitOnboarding: async () => {},
          resetOnboarding: async () => {},
          canAccessPath: () => true,
          canPerform: () => true,
        }}
      >
        <ProfileSettingsPage />
      </AuthContext.Provider>,
    );

    await user.type(screen.getByLabelText(/Display name/i), ' Updated');
    await user.clear(screen.getByLabelText(/Workspace brand/i));
    await user.type(screen.getByLabelText(/Workspace brand/i), 'FaithHub Plus');
    await user.click(screen.getByRole('button', { name: /Save changes/i }));

    expect(setWorkspace).toHaveBeenCalledWith({
      brand: 'FaithHub Plus',
      campus: 'Kampala Central',
    });
    expect(await screen.findByText(/Profile settings saved successfully/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset/i }));
    expect(await screen.findByText(/Profile form reset/i)).toBeInTheDocument();
  });
});

