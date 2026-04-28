export type UserRole = 'leadership' | 'production' | 'outreach' | 'finance';
export type Permission =
  | 'finance:read'
  | 'finance:manage'
  | 'content:manage'
  | 'live:operate'
  | 'audience:manage'
  | 'beacon:manage'
  | 'community:manage'
  | 'teams:manage'
  | 'workspace:admin'
  | (string & {});

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
  permissions: Permission[];
  routePermissions: Record<string, Permission[]>;
  actionPermissions: Record<string, Permission[]>;
};
