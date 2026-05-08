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
    route: '/faithhub/provider/dashboard',
  },
  {
    key: 'create-teaching',
    label: 'Create Teaching',
    shortcut: 'C T',
    hint: 'Start a new teaching draft',
    route: '/faithhub/provider/teachings-dashboard',
  },
  {
    key: 'review',
    label: 'Review',
    shortcut: 'G R',
    hint: 'Open moderation and pending reviews',
    route: '/faithhub/provider/reviews-and-moderation',
  },
  {
    key: 'publish',
    label: 'Publish',
    shortcut: 'G P',
    hint: 'Go to publish-ready workflow',
    route: '/faithhub/provider/live-builder',
  },
];

export const teachingsShortcutRouteMap: Record<string, string> = teachingsQuickActions.reduce(
  (acc, action) => {
    acc[action.shortcut.toLowerCase()] = action.route;
    return acc;
  },
  {} as Record<string, string>,
);

