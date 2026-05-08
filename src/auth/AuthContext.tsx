import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getProviderOnboardingRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  saveProviderOnboardingDraftRequest,
  submitProviderOnboardingRequest,
} from './authApi';
import {
  clearStoredOnboardingDraft,
  clearStoredOnboardingStatus,
  clearStoredToken,
  clearStoredWorkspace,
  DEFAULT_ONBOARDING_DRAFT,
  getStoredOnboardingDraft,
  getStoredOnboardingStatus,
  getStoredToken,
  getStoredWorkspace,
  setStoredOnboardingDraft,
  setStoredOnboardingStatus,
  setStoredToken,
  setStoredWorkspace,
} from './storage';
import { hasAllPermissions } from './permissions';
import type { AuthUser, ProviderOnboardingDraft, ProviderOnboardingStatus, UserRole, WorkspaceContext } from './types';
import type { Permission } from './types';

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  role: UserRole | null;
  workspace: WorkspaceContext | null;
  permissions: Permission[];
  routePermissions: Record<string, Permission[]>;
  actionPermissions: Record<string, Permission[]>;
  onboardingStatus: ProviderOnboardingStatus;
  onboardingDraft: ProviderOnboardingDraft;
  isOnboardingComplete: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  setWorkspace: (workspace: WorkspaceContext) => void;
  setOnboardingDraft: (draft: ProviderOnboardingDraft) => void;
  setOnboardingStatus: (status: ProviderOnboardingStatus) => void;
  refreshOnboarding: () => Promise<void>;
  saveOnboardingDraft: (draft: ProviderOnboardingDraft) => Promise<void>;
  submitOnboarding: () => Promise<void>;
  canAccessPath: (path: string) => boolean;
  canPerform: (action: string) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [workspace, setWorkspaceState] = useState<WorkspaceContext | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [routePermissions, setRoutePermissions] = useState<Record<string, Permission[]>>({});
  const [actionPermissions, setActionPermissions] = useState<Record<string, Permission[]>>({});
  const [onboardingStatus, setOnboardingStatusState] = useState<ProviderOnboardingStatus>('not_started');
  const [onboardingDraft, setOnboardingDraftState] = useState<ProviderOnboardingDraft>(DEFAULT_ONBOARDING_DRAFT);
  const [loading, setLoading] = useState(true);

  const hardClear = useCallback(() => {
    clearStoredToken();
    clearStoredWorkspace();
    clearStoredOnboardingStatus();
    clearStoredOnboardingDraft();
    setToken(null);
    setUser(null);
    setRole(null);
    setWorkspaceState(null);
    setPermissions([]);
    setRoutePermissions({});
    setActionPermissions({});
    setOnboardingStatusState('not_started');
    setOnboardingDraftState(DEFAULT_ONBOARDING_DRAFT);
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const storedToken = getStoredToken();
        const storedWorkspace = getStoredWorkspace();
        if (!storedToken) return;

        const profile = await meRequest(storedToken);
        if (!active) return;

        setToken(storedToken);
        setUser(profile.user);
        setRole(profile.role);
        setPermissions(profile.permissions);
        setRoutePermissions(profile.routePermissions);
        setActionPermissions(profile.actionPermissions);
        const nextWorkspace = storedWorkspace ?? profile.workspace;
        setWorkspaceState(nextWorkspace);
        setStoredWorkspace(nextWorkspace);
        try {
          const onboarding = await getProviderOnboardingRequest(storedToken);
          setOnboardingStatusState(onboarding.status);
          setOnboardingDraftState(onboarding.draft);
          setStoredOnboardingStatus(onboarding.status);
          setStoredOnboardingDraft(onboarding.draft);
        } catch {
          setOnboardingStatusState(getStoredOnboardingStatus());
          setOnboardingDraftState(getStoredOnboardingDraft());
        }
      } catch {
        if (active) hardClear();
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, [hardClear]);

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true);
    try {
      const session = await loginRequest(input);
      const rememberMe = input.rememberMe ?? true;
      setStoredToken(session.token, rememberMe);
      setStoredWorkspace(session.workspace, rememberMe);
      setToken(session.token);
      setUser(session.user);
      setRole(session.role);
      setWorkspaceState(session.workspace);
      setPermissions(session.permissions);
      setRoutePermissions(session.routePermissions);
      setActionPermissions(session.actionPermissions);
      try {
        const onboarding = await getProviderOnboardingRequest(session.token);
        setOnboardingStatusState(onboarding.status);
        setOnboardingDraftState(onboarding.draft);
        setStoredOnboardingStatus(onboarding.status, rememberMe);
        setStoredOnboardingDraft(onboarding.draft, rememberMe);
      } catch {
        setOnboardingStatusState(getStoredOnboardingStatus());
        setOnboardingDraftState(getStoredOnboardingDraft());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token ?? getStoredToken() ?? undefined;
    try {
      await logoutRequest(currentToken);
    } finally {
      hardClear();
    }
  }, [hardClear, token]);

  const setWorkspace = useCallback((nextWorkspace: WorkspaceContext) => {
    setWorkspaceState(nextWorkspace);
    setStoredWorkspace(nextWorkspace);
  }, []);

  const setOnboardingDraft = useCallback((draft: ProviderOnboardingDraft) => {
    setOnboardingDraftState(draft);
    setStoredOnboardingDraft(draft);
  }, []);

  const setOnboardingStatus = useCallback((status: ProviderOnboardingStatus) => {
    setOnboardingStatusState(status);
    setStoredOnboardingStatus(status);
  }, []);

  const refreshOnboarding = useCallback(async () => {
    const currentToken = token ?? getStoredToken();
    if (!currentToken) return;
    const onboarding = await getProviderOnboardingRequest(currentToken);
    setOnboardingStatusState(onboarding.status);
    setOnboardingDraftState(onboarding.draft);
    setStoredOnboardingStatus(onboarding.status);
    setStoredOnboardingDraft(onboarding.draft);
  }, [token]);

  const saveOnboardingDraft = useCallback(
    async (draft: ProviderOnboardingDraft) => {
      const currentToken = token ?? getStoredToken();
      if (!currentToken) {
        setOnboardingDraft(draft);
        setOnboardingStatus('in_progress');
        return;
      }
      const onboarding = await saveProviderOnboardingDraftRequest(currentToken, draft);
      setOnboardingDraftState(onboarding.draft);
      setOnboardingStatusState(onboarding.status);
      setStoredOnboardingDraft(onboarding.draft);
      setStoredOnboardingStatus(onboarding.status);
    },
    [setOnboardingDraft, setOnboardingStatus, token],
  );

  const submitOnboarding = useCallback(async () => {
    const currentToken = token ?? getStoredToken();
    if (!currentToken) {
      setOnboardingStatus('submitted');
      return;
    }
    const onboarding = await submitProviderOnboardingRequest(currentToken);
    setOnboardingDraftState(onboarding.draft);
    setOnboardingStatusState(onboarding.status);
    setStoredOnboardingDraft(onboarding.draft);
    setStoredOnboardingStatus(onboarding.status);
  }, [setOnboardingStatus, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      workspace,
      permissions,
      routePermissions,
      actionPermissions,
      onboardingStatus,
      onboardingDraft,
      isOnboardingComplete: onboardingStatus === 'approved',
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      logout,
      setWorkspace,
      setOnboardingDraft,
      setOnboardingStatus,
      refreshOnboarding,
      saveOnboardingDraft,
      submitOnboarding,
      canAccessPath: (path: string) => {
        const required = routePermissions[path] ?? [];
        return hasAllPermissions(permissions, required);
      },
      canPerform: (action: string) => {
        const required = actionPermissions[action] ?? [];
        return hasAllPermissions(permissions, required);
      },
    }),
    [
      actionPermissions,
      loading,
      login,
      logout,
      onboardingDraft,
      onboardingStatus,
      permissions,
      role,
      refreshOnboarding,
      routePermissions,
      saveOnboardingDraft,
      setOnboardingDraft,
      setOnboardingStatus,
      setWorkspace,
      submitOnboarding,
      token,
      user,
      workspace,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
