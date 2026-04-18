import type { WorkspaceContext } from './types';

const TOKEN_KEY = 'faithhub.auth.token';
const WORKSPACE_KEY = 'faithhub.auth.workspace';

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
