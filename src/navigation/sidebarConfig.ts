export interface SidebarItem {
  label: string;
  path: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

import { providerRoutes } from './providerRoutes';

export const sidebarSections: SidebarSection[] = [
  {
    id: 'core',
    title: 'CONTINUE',
    items: [
      { label: 'Continue Editing', path: providerRoutes.dashboardUi },
      { label: 'Workflow Dashboard', path: providerRoutes.dashboard },
    ],
  },
  {
    id: 'content',
    title: 'CREATE & DRAFTS',
    items: [
      { label: 'All Teachings', path: providerRoutes.teachingsDashboard },
      { label: 'Manage Content', path: providerRoutes.seriesDashboard },
      { label: 'Create Teaching Assets', path: providerRoutes.resourcesManager },
    ],
  },
  {
    id: 'live',
    title: 'PUBLISH',
    items: [
      { label: 'Create Teaching Live', path: providerRoutes.liveBuilder },
      { label: 'Publish Schedule', path: providerRoutes.liveSchedule },
      { label: 'Publishing Monitor', path: providerRoutes.liveDashboard },
    ],
  },
  {
    id: 'workspace',
    title: 'WORKSPACE',
    items: [
      { label: 'Workspace Settings', path: providerRoutes.workspaceSettings },
      { label: 'Dashboard', path: providerRoutes.dashboard },
    ],
  },
];
