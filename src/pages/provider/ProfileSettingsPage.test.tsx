import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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

    fireEvent.change(screen.getByLabelText(/Display name/i), { target: { value: 'Test User Updated' } });
    fireEvent.change(screen.getByLabelText(/Workspace brand/i), { target: { value: 'FaithHub Plus' } });
    await user.click(screen.getByRole('button', { name: /Save changes/i }));

    expect(setWorkspace).toHaveBeenCalledWith({
      brand: 'FaithHub Plus',
      campus: 'Kampala Central',
    });
    expect(screen.getByText(/Profile settings saved successfully/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset/i }));
    expect(screen.getByText(/Profile form reset/i)).toBeInTheDocument();
  }, 15000);
});
