import { describe, expect, it } from 'vitest';
import {
  getProviderOnboardingRequest,
  googleLoginRequest,
  loginRequest,
  meRequest,
  resetProviderOnboardingRequest,
  saveProviderOnboardingDraftRequest,
  submitProviderOnboardingRequest,
} from './authApi';

describe('authApi mock flows', () => {
  it('logs in admin user with email/password', async () => {
    const session = await loginRequest({
      email: 'admin@faithhub.dev',
      password: 'password123',
    });
    expect(session.role).toBe('admin');
    expect(session.token).toContain('mock-token-');
    expect(session.routePermissions).toEqual({});
  });

  it('rejects invalid email/password', async () => {
    await expect(
      loginRequest({
        email: 'admin@faithhub.dev',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password.');
  });

  it('supports google login fallback in mock mode', async () => {
    const session = await googleLoginRequest();
    expect(session.role).toBe('admin');
    expect(session.user.email).toBe('admin@faithhub.dev');
    expect(session.permissions.length).toBeGreaterThan(0);
  });

  it('supports preferred google account in mock mode', async () => {
    const session = await googleLoginRequest({ googleEmail: 'finance@faithhub.dev' });
    expect(session.role).toBe('finance');
    expect(session.user.email).toBe('finance@faithhub.dev');
    expect(session.routePermissions).toEqual({});
  });

  it('restores profile from mock token', async () => {
    const profile = await meRequest('mock-token-admin@faithhub.dev');
    expect(profile.role).toBe('admin');
    expect(profile.user.email).toBe('admin@faithhub.dev');
  });

  it('rejects unknown mock token', async () => {
    await expect(meRequest('mock-token-unknown@faithhub.dev')).rejects.toThrow('Session expired.');
  });

  it('persists onboarding draft in mock mode and supports submit/reset', async () => {
    const token = 'mock-token-admin@faithhub.dev';

    const initial = await getProviderOnboardingRequest(token);
    expect(initial.status).toBe('not_started');
    expect(initial.draft.organizationName).toBe('');

    const draft = {
      ...initial.draft,
      organizationName: 'FaithHub Kampala',
      contactName: 'Ayesiga Isaac',
      contactEmail: 'admin@faithhub.dev',
      agreedToTerms: true,
    };

    const saved = await saveProviderOnboardingDraftRequest(token, draft);
    expect(saved.status).toBe('in_progress');
    expect(saved.draft.organizationName).toBe('FaithHub Kampala');

    const submitted = await submitProviderOnboardingRequest(token);
    expect(submitted.status).toBe('submitted');
    expect(submitted.draft.organizationName).toBe('FaithHub Kampala');

    const savedAfterSubmit = await saveProviderOnboardingDraftRequest(token, {
      ...submitted.draft,
      city: 'Entebbe',
    });
    expect(savedAfterSubmit.status).toBe('submitted');
    expect(savedAfterSubmit.draft.city).toBe('Entebbe');

    const reset = await resetProviderOnboardingRequest(token);
    expect(reset.status).toBe('not_started');
    expect(reset.draft.organizationName).toBe('');
  });
});
