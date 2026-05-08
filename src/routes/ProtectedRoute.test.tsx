import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthContext } from '@/auth/AuthContext';
import type { Permission, ProviderOnboardingDraft, ProviderOnboardingStatus } from '@/auth/types';

type AuthValue = {
  isAuthenticated: boolean;
  loading: boolean;
  permissions: Permission[];
  onboardingStatus: ProviderOnboardingStatus;
};

const defaultDraft: ProviderOnboardingDraft = {
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

function renderWithAuth(initialPath: string, auth: AuthValue) {
  render(
    <AuthContext.Provider
      value={{
        user: auth.isAuthenticated ? { id: 'u1', name: 'Test', email: 'test@faithhub.dev' } : null,
        role: 'leadership',
        workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
        permissions: auth.permissions,
        routePermissions: {},
        actionPermissions: {},
        onboardingStatus: auth.onboardingStatus,
        onboardingDraft: defaultDraft,
        isOnboardingComplete: auth.onboardingStatus === 'approved',
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        login: async () => {},
        logout: async () => {},
        setWorkspace: () => {},
        setOnboardingDraft: () => {},
        setOnboardingStatus: () => {},
        canAccessPath: () => true,
        canPerform: () => true,
      }}
    >
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login</div>} />
          <Route
            path="/faithhub/provider/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faithhub/provider/onboarding"
            element={
              <ProtectedRoute>
                <div>Onboarding</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ProtectedRoute onboarding gating', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithAuth('/faithhub/provider/dashboard', {
      isAuthenticated: false,
      loading: false,
      permissions: [],
      onboardingStatus: 'not_started',
    });

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('redirects authenticated users to onboarding until approved', () => {
    renderWithAuth('/faithhub/provider/dashboard', {
      isAuthenticated: true,
      loading: false,
      permissions: [],
      onboardingStatus: 'in_progress',
    });

    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('allows dashboard when onboarding is approved', () => {
    renderWithAuth('/faithhub/provider/dashboard', {
      isAuthenticated: true,
      loading: false,
      permissions: [],
      onboardingStatus: 'approved',
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
