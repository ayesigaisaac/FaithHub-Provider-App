import { providerRoutes } from './providerRoutes';

export type TeachingsQuickActionKey =
  | 'continue-editing'
  | 'create-teaching'
  | 'review'
  | 'publish';

export type TeachingsQuickActionMeta = {
  key: TeachingsQuickActionKey;
  label: string;
  shortcut: string;
  hint: string;
  route: string;
};

export const teachingsQuickActions: TeachingsQuickActionMeta[] = [
  {
    key: 'continue-editing',
    label: 'Continue Editing',
    shortcut: 'G D',
    hint: 'Open your current in-progress teaching',
    route: providerRoutes.dashboard,
  },
  {
    key: 'create-teaching',
    label: 'Create Teaching',
    shortcut: 'C T',
    hint: 'Start a new teaching draft',
    route: providerRoutes.teachingsDashboard,
  },
  {
    key: 'review',
    label: 'Review',
    shortcut: 'G R',
    hint: 'Open moderation and pending reviews',
    route: providerRoutes.reviewsAndModeration,
  },
  {
    key: 'publish',
    label: 'Publish',
    shortcut: 'G P',
    hint: 'Go to publish-ready workflow',
    route: providerRoutes.liveBuilder,
  },
];

export const teachingsShortcutRouteMap: Record<string, string> = teachingsQuickActions.reduce(
  (acc, action) => {
    acc[action.shortcut.toLowerCase()] = action.route;
    return acc;
  },
  {} as Record<string, string>,
);
