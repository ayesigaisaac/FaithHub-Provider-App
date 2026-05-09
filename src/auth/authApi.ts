import { permissionsForRole } from './permissions';
import type {
  AuthSession,
  AuthUser,
  Permission,
  ProviderOnboardingDraft,
  ProviderOnboardingStatus,
  UserRole,
  WorkspaceContext,
} from './types';

type LoginPayload = {
  email: string;
  password: string;
};

type GoogleLoginPayload = {
  googleEmail?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const MOCK_ONBOARDING_KEY = 'faithhub.mock.onboarding.byToken';

type ProviderOnboardingState = {
  status: ProviderOnboardingStatus;
  draft: ProviderOnboardingDraft;
};

const DEFAULT_ONBOARDING_STATE: ProviderOnboardingState = {
  status: 'not_started',
  draft: {
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
};

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
    user: { id: 'u-admin-001', name: 'FaithHub Admin', email: 'admin@faithhub.dev' },
    password: 'password123',
    role: 'admin',
    workspace: { campus: 'HQ Operations', brand: 'FaithHub' },
  },
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
  if (raw === 'admin' || raw === 'production' || raw === 'outreach' || raw === 'finance') return raw;
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

function readMockOnboardingMap(): Record<string, ProviderOnboardingState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(MOCK_ONBOARDING_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProviderOnboardingState>) : {};
  } catch {
    return {};
  }
}

function writeMockOnboardingMap(data: Record<string, ProviderOnboardingState>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MOCK_ONBOARDING_KEY, JSON.stringify(data));
}

function getMockOnboardingState(token: string): ProviderOnboardingState {
  const map = readMockOnboardingMap();
  return map[token] ?? DEFAULT_ONBOARDING_STATE;
}

function setMockOnboardingState(token: string, state: ProviderOnboardingState) {
  const map = readMockOnboardingMap();
  map[token] = state;
  writeMockOnboardingMap(map);
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

export async function googleLoginRequest(payload: GoogleLoginPayload = {}): Promise<AuthSession> {
  const preferred = (payload.googleEmail || 'admin@faithhub.dev').trim().toLowerCase();

  if (!API_BASE_URL) {
    const mock = MOCK_USERS.find((item) => item.user.email.toLowerCase() === preferred) ?? MOCK_USERS[0];
    return {
      token: `mock-token-${mock.user.email.toLowerCase()}`,
      user: {
        ...mock.user,
        email: mock.user.email.toLowerCase(),
        name: toDisplayNameFromEmail(mock.user.email.toLowerCase()),
      },
      role: mock.role,
      workspace: mock.workspace,
      permissions: permissionsForRole(mock.role),
      routePermissions: buildDefaultRoutePermissions(mock.role),
      actionPermissions: {},
    };
  }

  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailHint: preferred }),
  });
  if (!res.ok) {
    throw new Error('Google sign-in is unavailable right now.');
  }

  const data = (await res.json()) as Partial<AuthSession> & {
    token?: string;
    user?: Partial<AuthUser>;
    role?: string;
    workspace?: Partial<WorkspaceContext>;
    permissions?: unknown;
    routePermissions?: unknown;
    actionPermissions?: unknown;
  };

  const token = data.token;
  if (!token) throw new Error('Google sign-in did not return a token.');

  const role = normalizeRole(data.role);
  const authorization = resolveAuthorization(data, role);
  return {
    token,
    user: {
      id: data.user?.id || `u-google-${Math.random().toString(36).slice(2, 9)}`,
      name: data.user?.name || toDisplayNameFromEmail(data.user?.email || preferred),
      email: data.user?.email || preferred,
    },
    role,
    workspace: normalizeWorkspace(data.workspace),
    permissions: authorization.permissions,
    routePermissions: authorization.routePermissions,
    actionPermissions: authorization.actionPermissions,
  };
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

export async function getProviderOnboardingRequest(token: string): Promise<ProviderOnboardingState> {
  if (!API_BASE_URL) {
    return getMockOnboardingState(token);
  }

  const res = await fetch(`${API_BASE_URL}/provider/onboarding`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Unable to load onboarding state.');
  }
  const data = (await res.json()) as Partial<ProviderOnboardingState>;
  return {
    status: data.status ?? 'not_started',
    draft: { ...DEFAULT_ONBOARDING_STATE.draft, ...(data.draft ?? {}) },
  };
}

export async function saveProviderOnboardingDraftRequest(
  token: string,
  draft: ProviderOnboardingDraft,
): Promise<ProviderOnboardingState> {
  if (!API_BASE_URL) {
    const current = getMockOnboardingState(token);
    const nextStatus: ProviderOnboardingStatus = current.status === 'submitted' ? 'submitted' : 'in_progress';
    const next = { status: nextStatus, draft };
    setMockOnboardingState(token, next);
    return next;
  }

  const res = await fetch(`${API_BASE_URL}/provider/onboarding/draft`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ draft }),
  });
  if (!res.ok) {
    throw new Error('Unable to save onboarding draft.');
  }
  const data = (await res.json()) as Partial<ProviderOnboardingState>;
  return {
    status: data.status ?? 'in_progress',
    draft: { ...DEFAULT_ONBOARDING_STATE.draft, ...(data.draft ?? draft) },
  };
}

export async function submitProviderOnboardingRequest(token: string): Promise<ProviderOnboardingState> {
  if (!API_BASE_URL) {
    const current = getMockOnboardingState(token);
    const next = { ...current, status: 'submitted' as ProviderOnboardingStatus };
    setMockOnboardingState(token, next);
    return next;
  }

  const res = await fetch(`${API_BASE_URL}/provider/onboarding/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Unable to submit onboarding.');
  }
  const data = (await res.json()) as Partial<ProviderOnboardingState>;
  return {
    status: data.status ?? 'submitted',
    draft: { ...DEFAULT_ONBOARDING_STATE.draft, ...(data.draft ?? {}) },
  };
}

export async function resetProviderOnboardingRequest(token: string): Promise<ProviderOnboardingState> {
  if (!API_BASE_URL) {
    const next: ProviderOnboardingState = {
      status: 'not_started',
      draft: DEFAULT_ONBOARDING_STATE.draft,
    };
    setMockOnboardingState(token, next);
    return next;
  }

  const res = await fetch(`${API_BASE_URL}/provider/onboarding/reset`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Unable to reset onboarding.');
  }
  const data = (await res.json()) as Partial<ProviderOnboardingState>;
  return {
    status: data.status ?? 'not_started',
    draft: { ...DEFAULT_ONBOARDING_STATE.draft, ...(data.draft ?? DEFAULT_ONBOARDING_STATE.draft) },
  };
}
