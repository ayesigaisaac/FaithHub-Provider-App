import type { Permission, UserRole } from './types';

const rolePermissions: Record<UserRole, Permission[]> = {
  leadership: [
    'finance:read',
    'finance:manage',
    'content:manage',
    'live:operate',
    'audience:manage',
    'beacon:manage',
    'community:manage',
    'teams:manage',
    'workspace:admin',
  ],
  finance: ['finance:read', 'finance:manage'],
  production: ['content:manage', 'live:operate', 'beacon:manage'],
  outreach: ['audience:manage', 'community:manage'],
};

export function permissionsForRole(role: UserRole | null): Permission[] {
  if (!role) return [];
  return rolePermissions[role] ?? [];
}

export function hasAllPermissions(grantedPermissions: Permission[], required: Permission[]): boolean {
  if (!required.length) return true;
  const granted = new Set(grantedPermissions);
  return required.every((permission) => granted.has(permission));
}
