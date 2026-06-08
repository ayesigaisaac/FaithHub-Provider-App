import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BriefcaseBusinessRoundedIcon from '@mui/icons-material/BriefcaseBusinessRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import RadioRoundedIcon from '@mui/icons-material/RadioRounded';
import type { ReactNode } from 'react';
import type { ProviderPageSection } from './providerPages';
import { providerCategoryMeta } from './providerCategories';

export type TopbarTab = {
  label: string;
  to: string;
  sections: ProviderPageSection[];
  icon: ReactNode;
};

export type MobileBottomNavTab = {
  label: string;
  value: string;
  icon: ReactNode;
};

const sectionByNavLabel = providerCategoryMeta.reduce<Record<string, ProviderPageSection>>((acc, item) => {
  acc[item.navLabel] = item.section;
  return acc;
}, {});

function category(navLabel: string): ProviderPageSection {
  const section = sectionByNavLabel[navLabel];
  if (!section) {
    throw new Error(`Unknown provider category label: ${navLabel}`);
  }
  return section;
}

export const topbarTabs: TopbarTab[] = [
  {
    label: 'Dashboard',
    to: '/faithhub/provider/dashboard',
    sections: [category('Foundation'), category('Journey'), category('Content')],
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    label: 'Streams',
    to: '/faithhub/provider/live-dashboard',
    sections: [category('Live Ops')],
    icon: <PlayCircleOutlineRoundedIcon fontSize="small" />,
  },
  {
    label: 'Community',
    to: '/faithhub/provider/community-groups',
    sections: [category('Audience'), category('Community')],
    icon: <GroupsRoundedIcon fontSize="small" />,
  },
  {
    label: 'Reports',
    to: '/faithhub/provider/reviews-and-moderation',
    sections: [category('Post-live'), category('Leadership'), category('Settings'), category('Revelight'), category('Previews')],
    icon: <EventNoteRoundedIcon fontSize="small" />,
  },
];

export const mobileBottomNavTabs: MobileBottomNavTab[] = [
  { label: 'Dashboard', value: '/faithhub/provider/dashboard', icon: DashboardRoundedIcon },
  { label: 'Services', value: '/faithhub/provider/services', icon: BriefcaseBusinessRoundedIcon },
  { label: 'Campaigns', value: '/faithhub/provider/campaigns', icon: CampaignRoundedIcon },
  { label: 'Live', value: '/faithhub/provider/live-dashboard', icon: RadioRoundedIcon },
];

export function resolveMobileBottomNavValue(input: {
  pathname: string;
  fallback?: string;
  findProviderPageByPath: (pathname: string) => { path: string; aliases?: string[]; section?: ProviderPageSection } | undefined;
}): string {
  const fallback = input.fallback ?? mobileBottomNavTabs[0].value;
  const page = input.findProviderPageByPath(input.pathname);
  if (!page) return fallback;
  const hit = mobileBottomNavTabs.find((tab) => page.path === tab.value || page.aliases?.includes(tab.value));
  if (hit) return hit.value;
  if (page.section === 'Provider Journey') return '/faithhub/provider/services';
  if (page.section === 'Live Sessions Operations') return '/faithhub/provider/live-dashboard';
  return fallback;
}
