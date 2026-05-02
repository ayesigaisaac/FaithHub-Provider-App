export interface SidebarItem {
  label: string;
  path: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'core',
    title: 'CONTINUE',
    items: [
      { label: 'Continue Editing', path: '/dashboard-ui' },
      { label: 'Workflow Dashboard', path: '/faithhub/provider/dashboard' },
    ],
  },
  {
    id: 'content',
    title: 'CREATE & DRAFTS',
    items: [
      { label: 'All Teachings', path: '/faithhub/provider/teachings-dashboard' },
      { label: 'Manage Content', path: '/faithhub/provider/series-dashboard' },
      { label: 'Create Teaching Assets', path: '/faithhub/provider/resources-manager' },
    ],
  },
  {
    id: 'live',
    title: 'PUBLISH',
    items: [
      { label: 'Create Teaching Live', path: '/faithhub/provider/live-builder' },
      { label: 'Publish Schedule', path: '/faithhub/provider/live-schedule' },
      { label: 'Publishing Monitor', path: '/faithhub/provider/live-dashboard' },
    ],
  },
  {
    id: 'workspace',
    title: 'WORKSPACE',
    items: [
      { label: 'Workspace Settings', path: '/faithhub/provider/workspace-settings' },
      { label: 'Support Home', path: '/faithhub/home-landing' },
    ],
  },
];
