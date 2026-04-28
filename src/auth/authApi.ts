import { permissionsForRole } from './permissions';
import type { AuthSession, AuthUser, Permission, UserRole, WorkspaceContext } from './types';

type LoginPayload = {
  email: string;
  password: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function toDisplayNameFromEmail(email: string) {
  const local = (email.split('@')[0] || 'user').trim();
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const MOCK_USERS: Array<{
  user: AuthUser;
  password: string;
  role: UserRole;
  workspace: WorkspaceContext;
}> = [
  {
    user: { id: 'u-lead-001', name: 'Ayesiga Leadership', email: 'leadership@faithhub.dev' },
    password: 'password123',
    role: 'leadership',
    workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
  },
  {
    user: { id: 'u-prod-001', name: 'Production Admin', email: 'production@faithhub.dev' },
    password: 'password123',
    role: 'production',
    workspace: { campus: 'Online Studio', brand: 'FaithHub' },
  },
  {
    user: { id: 'u-outreach-001', name: 'Outreach Admin', email: 'outreach@faithhub.dev' },
    password: 'password123',
    role: 'outreach',
    workspace: { campus: 'East Campus', brand: 'FaithHub' },
  },
  {
    user: { id: 'u-fin-001', name: 'Finance Admin', email: 'finance@faithhub.dev' },
    password: 'password123',
    role: 'finance',
    workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
  },
];

function normalizeRole(raw?: string): UserRole {
  if (raw === 'production' || raw === 'outreach' || raw === 'finance') return raw;
  return 'leadership';
}

function normalizeWorkspace(raw?: Partial<WorkspaceContext>): WorkspaceContext {
  return {
    campus: raw?.campus || 'Kampala Central',
    brand: raw?.brand || 'FaithHub',
  };
}

function getMockByToken(token: string) {
  const email = token.replace('mock-token-', '');
  return MOCK_USERS.find((item) => item.user.email === email);
}

function normalizePermissionList(value: unknown): Permission[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is Permission => typeof entry === 'string');
}

function buildDefaultRoutePermissions(role: UserRole): Record<string, Permission[]> {
  if (role === 'finance' || role === 'leadership') {
    return {};
  }
  return {
    '/faithhub/provider/donations-and-funds': ['finance:read'],
    '/faithhub/provider/wallet-payouts': ['finance:read'],
    '/faithhub/provider/subscriptions': ['finance:read'],
  };
}

function normalizeRoutePermissions(value: unknown): Record<string, Permission[]> {
  if (!value || typeof value !== 'object') return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, Permission[]>>((acc, [path, required]) => {
    const permissions = normalizePermissionList(required);
    if (permissions.length) {
      acc[path] = permissions;
    }
    return acc;
  }, {});
}

function normalizeActionPermissions(value: unknown): Record<string, Permission[]> {
  if (!value || typeof value !== 'object') return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, Permission[]>>((acc, [action, required]) => {
    const permissions = normalizePermissionList(required);
    if (permissions.length) {
      acc[action] = permissions;
    }
    return acc;
  }, {});
}

function resolveAuthorization(payload: unknown, role: UserRole) {
  const authz = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const nested = (authz.authorization && typeof authz.authorization === 'object'
    ? authz.authorization
    : {}) as Record<string, unknown>;

  const permissions = normalizePermissionList(authz.permissions ?? nested.permissions);
  const routePermissions = normalizeRoutePermissions(authz.routePermissions ?? nested.routePermissions ?? nested.routes);
  const actionPermissions = normalizeActionPermissions(authz.actionPermissions ?? nested.actionPermissions ?? nested.actions);

  return {
    permissions: permissions.length ? permissions : permissionsForRole(role),
    routePermissions: Object.keys(routePermissions).length ? routePermissions : buildDefaultRoutePermissions(role),
    actionPermissions,
  };
}

async function mockLogin(payload: LoginPayload): Promise<AuthSession> {
  const hit = MOCK_USERS.find((item) => item.user.email.toLowerCase() === payload.email.toLowerCase());
  if (!hit || hit.password !== payload.password) {
    throw new Error('Invalid email or password.');
  }
  const normalizedEmail = payload.email.trim().toLowerCase();
  return {
    token: `mock-token-${normalizedEmail}`,
    user: {
      ...hit.user,
      email: normalizedEmail,
      name: toDisplayNameFromEmail(normalizedEmail),
    },
    role: hit.role,
    workspace: hit.workspace,
    permissions: permissionsForRole(hit.role),
    routePermissions: buildDefaultRoutePermissions(hit.role),
    actionPermissions: {},
  };
}

async function mockMe(token: string): Promise<Omit<AuthSession, 'token'>> {
  const hit = getMockByToken(token);
  if (!hit) {
    throw new Error('Session expired.');
  }
  return {
    user: {
      ...hit.user,
      name: toDisplayNameFromEmail(hit.user.email),
    },
    role: hit.role,
    workspace: hit.workspace,
    permissions: permissionsForRole(hit.role),
    routePermissions: buildDefaultRoutePermissions(hit.role),
    actionPermissions: {},
  };
}

async function backendLogin(payload: LoginPayload): Promise<AuthSession> {
  if (!API_BASE_URL) {
    return mockLogin(payload);
  }

  const loginRes = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!loginRes.ok) {
    const message = loginRes.status === 401 ? 'Invalid email or password.' : 'Unable to sign in right now.';
    throw new Error(message);
  }

  const loginData = await loginRes.json();
  const token = loginData?.token || loginData?.accessToken;
  if (!token) {
    throw new Error('Login response did not return a token.');
  }

  const meRes = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) {
    throw new Error('Unable to load profile after login.');
  }
  const meData = await meRes.json();
  const role = normalizeRole(meData?.role);
  const authorization = resolveAuthorization(meData, role);

  return {
    token,
    user: {
      id: meData?.id || 'u-fallback',
      name: meData?.name || meData?.fullName || toDisplayNameFromEmail(payload.email),
      email: meData?.email || payload.email,
    },
    role,
    workspace: normalizeWorkspace(meData?.workspace),
    permissions: authorization.permissions,
    routePermissions: authorization.routePermissions,
    actionPermissions: authorization.actionPermissions,
  };
}

export async function loginRequest(payload: LoginPayload): Promise<AuthSession> {
  try {
    return await backendLogin(payload);
  } catch (error) {
    if (API_BASE_URL) throw error;
    return mockLogin(payload);
  }
}

export async function meRequest(token: string): Promise<Omit<AuthSession, 'token'>> {
  if (!API_BASE_URL) {
    return mockMe(token);
  }

  const meRes = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) {
    throw new Error('Session invalid.');
  }
  const meData = await meRes.json();
  const role = normalizeRole(meData?.role);
  const authorization = resolveAuthorization(meData, role);
  return {
    user: {
      id: meData?.id || 'u-fallback',
      name: meData?.name || meData?.fullName || toDisplayNameFromEmail(meData?.email || 'user@faithhub.dev'),
      email: meData?.email || 'unknown@faithhub.dev',
    },
    role,
    workspace: normalizeWorkspace(meData?.workspace),
    permissions: authorization.permissions,
    routePermissions: authorization.routePermissions,
    actionPermissions: authorization.actionPermissions,
  };
}

export async function logoutRequest(token?: string): Promise<void> {
  if (!API_BASE_URL || !token) return;
  await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
