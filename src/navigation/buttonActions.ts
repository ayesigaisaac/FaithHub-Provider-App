import { providerPages } from '@/navigation/providerPages';

type ButtonActionKind = 'navigate' | 'copy_link' | 'preview_mode';

type ButtonActionDefinition = {
  kind: ButtonActionKind;
  targetPath?: string;
  previewMode?: 'desktop' | 'mobile';
  fallbackKeywords?: string[];
};

export const buttonActionRegistry = {
  open_provider_dashboard: { kind: 'navigate', targetPath: '/faithhub/provider/dashboard', fallbackKeywords: ['dashboard', 'overview'] },
  open_live_dashboard: { kind: 'navigate', targetPath: '/faithhub/provider/live-dashboard', fallbackKeywords: ['live', 'watch', 'trailer', 'join', 'preview'] },
  open_live_builder: { kind: 'navigate', targetPath: '/faithhub/provider/live-builder', fallbackKeywords: ['live builder', 'build live'] },
  open_donations_funds: { kind: 'navigate', targetPath: '/faithhub/provider/donations-and-funds', fallbackKeywords: ['give', 'giving', 'donat', 'support', 'complete donation'] },
  open_charity_crowdfunding: { kind: 'navigate', targetPath: '/faithhub/provider/charity-crowdfunding-workbench', fallbackKeywords: ['crowdfund'] },
  open_prayer_requests: { kind: 'navigate', targetPath: '/faithhub/provider/prayer-requests', fallbackKeywords: ['pray', 'prayer', 'circle'] },
  open_resources_manager: { kind: 'navigate', targetPath: '/faithhub/provider/resources-manager', fallbackKeywords: ['resource', 'note', 'book', 'download'] },
  open_standalone_teaching_builder: { kind: 'navigate', targetPath: '/faithhub/provider/standalone-teaching-builder', fallbackKeywords: ['standalone teaching'] },
  open_merchandise_builder: { kind: 'navigate', targetPath: '/faithhub/provider/merchandise-builder', fallbackKeywords: ['merchandise', 'store', 'item'] },
  open_events_manager: { kind: 'navigate', targetPath: '/faithhub/provider/events-manager', fallbackKeywords: ['event', 'ticket'] },
  open_noticeboard: { kind: 'navigate', targetPath: '/faithhub/provider/noticeboard', fallbackKeywords: ['noticeboard', 'notice', 'board'] },
  open_projects: { kind: 'navigate', targetPath: '/faithhub/provider/projects', fallbackKeywords: ['project', 'template'] },
  open_beacon_dashboard: { kind: 'navigate', targetPath: '/faithhub/provider/beacon-dashboard', fallbackKeywords: ['beacon', 'campaign', 'cta'] },
  open_audience_notifications: { kind: 'navigate', targetPath: '/faithhub/provider/audience-notifications', fallbackKeywords: ['audience', 'notification', 'reminder', 'notify'] },
  open_wallet_payouts: { kind: 'navigate', targetPath: '/faithhub/provider/wallet-payouts', fallbackKeywords: ['wallet', 'payout', 'transfer'] },
  open_roles_permissions: { kind: 'navigate', targetPath: '/faithhub/provider/roles-permissions', fallbackKeywords: ['team', 'leadership', 'role', 'permission'] },
  open_community_groups: { kind: 'navigate', targetPath: '/faithhub/provider/community-groups', fallbackKeywords: ['follow', 'story', 'community'] },
  open_testimonies: { kind: 'navigate', targetPath: '/faithhub/provider/testimonies', fallbackKeywords: ['testimony'] },
  open_counseling: { kind: 'navigate', targetPath: '/faithhub/provider/counseling', fallbackKeywords: ['counsel', 'encouragement', 'follow-up', 'secure note'] },
  open_teachings_dashboard: { kind: 'navigate', targetPath: '/faithhub/provider/teachings-dashboard', fallbackKeywords: ['teaching'] },
  open_series_dashboard: { kind: 'navigate', targetPath: '/faithhub/provider/series-dashboard', fallbackKeywords: ['series', 'episode'] },
  copy_current_link: { kind: 'copy_link', fallbackKeywords: ['share'] },
  set_preview_desktop: { kind: 'preview_mode', previewMode: 'desktop', fallbackKeywords: ['desktop'] },
  set_preview_mobile: { kind: 'preview_mode', previewMode: 'mobile', fallbackKeywords: ['mobile'] },
} as const satisfies Record<string, ButtonActionDefinition>;

export type ButtonActionId = keyof typeof buttonActionRegistry;
export type ButtonAction = (typeof buttonActionRegistry)[ButtonActionId];

export function getButtonAction(id: ButtonActionId): ButtonAction {
  return buttonActionRegistry[id];
}

export function isButtonActionId(value: string): value is ButtonActionId {
  return value in buttonActionRegistry;
}

export function resolveActionFromLabel(label: string): ButtonActionId | null {
  const normalized = label.trim().toLowerCase();
  if (!normalized) return null;

  const prioritisedOrder: ButtonActionId[] = [
    'set_preview_desktop',
    'set_preview_mobile',
    'copy_current_link',
    'open_wallet_payouts',
    'open_merchandise_builder',
    'open_standalone_teaching_builder',
    'open_live_builder',
    'open_donations_funds',
    'open_charity_crowdfunding',
    'open_prayer_requests',
    'open_counseling',
    'open_testimonies',
    'open_resources_manager',
    'open_events_manager',
    'open_noticeboard',
    'open_projects',
    'open_beacon_dashboard',
    'open_audience_notifications',
    'open_roles_permissions',
    'open_community_groups',
    'open_series_dashboard',
    'open_teachings_dashboard',
    'open_live_dashboard',
    'open_provider_dashboard',
  ];

  for (const actionId of prioritisedOrder) {
    const keywords = buttonActionRegistry[actionId].fallbackKeywords ?? [];
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return actionId;
    }
  }

  return 'open_provider_dashboard';
}

function validateButtonActionTargets(): void {
  const knownPaths = new Set<string>([
    '/faithhub/home-landing',
    '/faithhub/provider',
    '/dashboard-ui',
  ]);

  providerPages.forEach((page) => {
    knownPaths.add(page.path);
    page.aliases?.forEach((alias) => knownPaths.add(alias));
  });

  (Object.keys(buttonActionRegistry) as ButtonActionId[]).forEach((actionId) => {
    const action = buttonActionRegistry[actionId];
    const targetPath = action.kind === 'navigate' ? action.targetPath : undefined;
    if (!targetPath) return;
    if (!knownPaths.has(targetPath)) {
      console.warn(`[buttonActions] Unknown route for action "${actionId}": ${targetPath}`);
    }
  });
}

if (import.meta.env.DEV) {
  validateButtonActionTargets();
}
