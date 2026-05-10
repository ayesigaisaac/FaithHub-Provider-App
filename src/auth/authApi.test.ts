import { describe, expect, it } from 'vitest';
import { googleLoginRequest, loginRequest, meRequest } from './authApi';

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

  it('supports google login fallback in mock mode', async () => {
    const session = await googleLoginRequest();
    expect(session.role).toBe('admin');
    expect(session.user.email).toBe('admin@faithhub.dev');
    expect(session.permissions.length).toBeGreaterThan(0);
  });

  it('restores profile from mock token', async () => {
    const profile = await meRequest('mock-token-admin@faithhub.dev');
    expect(profile.role).toBe('admin');
    expect(profile.user.email).toBe('admin@faithhub.dev');
  });
});

