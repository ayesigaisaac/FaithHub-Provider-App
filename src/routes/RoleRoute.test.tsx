import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RoleRoute } from './RoleRoute';
import { AuthContext } from '@/auth/AuthContext';
import type { UserRole, ProviderOnboardingDraft } from '@/auth/types';

const draft: ProviderOnboardingDraft = {
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
};

function renderWithRole(role: UserRole | null) {
  render(
    <AuthContext.Provider
      value={{
        user: role ? { id: 'u1', name: 'User', email: 'user@faithhub.dev' } : null,
        role,
        workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
        permissions: [],
        routePermissions: {},
        actionPermissions: {},
        onboardingStatus: 'approved',
        onboardingDraft: draft,
        isOnboardingComplete: true,
        isAuthenticated: Boolean(role),
        loading: false,
        login: async () => {},
        loginWithGoogle: async () => {},
        logout: async () => {},
        setWorkspace: () => {},
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
      <MemoryRouter initialEntries={['/faithhub/admin/dashboard']}>
        <Routes>
          <Route path="/faithhub/provider/dashboard" element={<div>Provider Dashboard</div>} />
          <Route
            path="/faithhub/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin', 'leadership']}>
                <div>Admin Dashboard</div>
              </RoleRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('RoleRoute', () => {
  it('allows admin role', () => {
    renderWithRole('admin');
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('redirects disallowed role to provider dashboard', () => {
    renderWithRole('production');
    expect(screen.getByText('Provider Dashboard')).toBeInTheDocument();
  });
});

