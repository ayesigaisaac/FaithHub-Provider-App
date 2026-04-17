import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import type { ReactNode } from 'react';

export type TopbarTab = {
  label: string;
  to: string;
  sections: string[];
  icon: ReactNode;
};

export const topbarTabs: TopbarTab[] = [
  {
    label: 'Dashboard',
    to: '/faithhub/provider/dashboard',
    sections: ['Foundation & Mission Control', 'Content Structure & Teaching Creation'],
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    label: 'Streams',
    to: '/faithhub/provider/live-dashboard',
    sections: ['Live Sessions Operations'],
    icon: <PlayCircleOutlineRoundedIcon fontSize="small" />,
  },
  {
    label: 'Community',
    to: '/faithhub/provider/community-groups',
    sections: ['Audience & Outreach', 'Community & Care'],
    icon: <GroupsRoundedIcon fontSize="small" />,
  },
  {
    label: 'Giving',
    to: '/faithhub/provider/donations-and-funds',
    sections: ['Events & Giving'],
    icon: <VolunteerActivismRoundedIcon fontSize="small" />,
  },
  {
    label: 'Reports',
    to: '/faithhub/provider/reviews-and-moderation',
    sections: ['Post-live & Trust', 'Leadership & Team', 'Workspace Settings', 'Beacon', 'Previews'],
    icon: <EventNoteRoundedIcon fontSize="small" />,
  },
];
