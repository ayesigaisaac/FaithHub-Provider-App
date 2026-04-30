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
    title: 'CORE',
    items: [
      { label: 'Dashboard', path: '/dashboard-ui' },
      { label: 'Provider Dashboard', path: '/faithhub/provider/dashboard' },
    ],
  },
  {
    id: 'content',
    title: 'CONTENT',
    items: [
      { label: 'Teachings Dashboard', path: '/faithhub/provider/teachings-dashboard' },
      { label: 'Series Dashboard', path: '/faithhub/provider/series-dashboard' },
      { label: 'Resources Manager', path: '/faithhub/provider/resources-manager' },
    ],
  },
  {
    id: 'live',
    title: 'LIVE',
    items: [
      { label: 'Live Builder', path: '/faithhub/provider/live-builder' },
      { label: 'Live Schedule', path: '/faithhub/provider/live-schedule' },
      { label: 'Live Dashboard', path: '/faithhub/provider/live-dashboard' },
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