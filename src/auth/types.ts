export type UserRole = 'leadership' | 'production' | 'outreach' | 'finance';

export type WorkspaceContext = {
  campus: string;
  brand: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  role: UserRole;
  workspace: WorkspaceContext;
};
