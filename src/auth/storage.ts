import type { ProviderOnboardingDraft, ProviderOnboardingStatus, WorkspaceContext } from './types';

const TOKEN_KEY = 'faithhub.auth.token';
const WORKSPACE_KEY = 'faithhub.auth.workspace';
const ONBOARDING_STATUS_KEY = 'faithhub.provider.onboarding.status';
const ONBOARDING_DRAFT_KEY = 'faithhub.provider.onboarding.draft';

export const DEFAULT_ONBOARDING_DRAFT: ProviderOnboardingDraft = {
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

function getStorage(rememberMe: boolean) {
  return rememberMe ? localStorage : sessionStorage;
}

function getFromEitherStorage(key: string) {
  const sessionValue = sessionStorage.getItem(key);
  if (sessionValue) return sessionValue;
  return localStorage.getItem(key);
}

export function getStoredToken() {
  return getFromEitherStorage(TOKEN_KEY);
}

export function setStoredToken(token: string, rememberMe = true) {
  clearStoredToken();
  getStorage(rememberMe).setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getStoredWorkspace(): WorkspaceContext | null {
  const raw = getFromEitherStorage(WORKSPACE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.campus || !parsed?.brand) return null;
    return parsed as WorkspaceContext;
  } catch {
    return null;
  }
}

export function setStoredWorkspace(workspace: WorkspaceContext, rememberMe = true) {
  clearStoredWorkspace();
  getStorage(rememberMe).setItem(WORKSPACE_KEY, JSON.stringify(workspace));
}

export function clearStoredWorkspace() {
  localStorage.removeItem(WORKSPACE_KEY);
  sessionStorage.removeItem(WORKSPACE_KEY);
}

function isOnboardingStatus(value: string): value is ProviderOnboardingStatus {
  return value === 'not_started' || value === 'in_progress' || value === 'submitted' || value === 'approved';
}

export function getStoredOnboardingStatus(): ProviderOnboardingStatus {
  const value = getFromEitherStorage(ONBOARDING_STATUS_KEY);
  if (!value || !isOnboardingStatus(value)) return 'not_started';
  return value;
}

export function setStoredOnboardingStatus(status: ProviderOnboardingStatus, rememberMe = true) {
  clearStoredOnboardingStatus();
  getStorage(rememberMe).setItem(ONBOARDING_STATUS_KEY, status);
}

export function clearStoredOnboardingStatus() {
  localStorage.removeItem(ONBOARDING_STATUS_KEY);
  sessionStorage.removeItem(ONBOARDING_STATUS_KEY);
}

export function getStoredOnboardingDraft(): ProviderOnboardingDraft {
  const raw = getFromEitherStorage(ONBOARDING_DRAFT_KEY);
  if (!raw) return DEFAULT_ONBOARDING_DRAFT;

  try {
    const parsed = JSON.parse(raw) as Partial<ProviderOnboardingDraft>;
    return {
      ...DEFAULT_ONBOARDING_DRAFT,
      ...parsed,
      organizationType:
        parsed.organizationType === 'church' ||
        parsed.organizationType === 'ministry' ||
        parsed.organizationType === 'events' ||
        parsed.organizationType === 'digital'
          ? parsed.organizationType
          : DEFAULT_ONBOARDING_DRAFT.organizationType,
      agreedToTerms: Boolean(parsed.agreedToTerms),
    };
  } catch {
    return DEFAULT_ONBOARDING_DRAFT;
  }
}

export function setStoredOnboardingDraft(draft: ProviderOnboardingDraft, rememberMe = true) {
  clearStoredOnboardingDraft();
  getStorage(rememberMe).setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
}

export function clearStoredOnboardingDraft() {
  localStorage.removeItem(ONBOARDING_DRAFT_KEY);
  sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
}
