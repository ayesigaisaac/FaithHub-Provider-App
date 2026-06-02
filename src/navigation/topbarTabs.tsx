import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import type { ReactNode } from 'react';
import type { ProviderPageSection } from './providerPages';
import { providerCategoryMeta } from './providerCategories';

export type TopbarTab = {
  label: string;
  to: string;
  sections: ProviderPageSection[];
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
