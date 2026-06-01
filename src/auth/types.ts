export type UserRole = 'admin' | 'leadership' | 'production' | 'outreach' | 'finance';
export type Permission =
  | 'finance:read'
  | 'finance:manage'
  | 'content:manage'
  | 'live:operate'
  | 'audience:manage'
  | 'revelight:manage'
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

export type ProviderOnboardingStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved';

export type ProviderOnboardingDraft = {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationType: 'church' | 'ministry' | 'events' | 'digital';
  country: string;
  city: string;
  mission: string;
  website: string;
  primaryLanguage: string;
  agreedToTerms: boolean;
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
