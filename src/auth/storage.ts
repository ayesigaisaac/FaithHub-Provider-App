import type { WorkspaceContext } from './types';

const TOKEN_KEY = 'faithhub.auth.token';
const WORKSPACE_KEY = 'faithhub.auth.workspace';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredWorkspace(): WorkspaceContext | null {
  const raw = localStorage.getItem(WORKSPACE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.campus || !parsed?.brand) return null;
    return parsed as WorkspaceContext;
  } catch {
    return null;
  }
}

export function setStoredWorkspace(workspace: WorkspaceContext) {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
}

export function clearStoredWorkspace() {
  localStorage.removeItem(WORKSPACE_KEY);
}
