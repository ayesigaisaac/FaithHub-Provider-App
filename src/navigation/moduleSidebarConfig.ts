import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gauge,
  Globe,
  HandHeart,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  PlayCircle,
  RadioTower,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wallet,
} from 'lucide-react';

export interface ModuleSubItem {
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
}

export interface SidebarModule {
  title:
    | 'CORE'
    | 'CONTENT'
    | 'STREAM'
    | 'OUTREACH'
    | 'POST-LIVE'
    | 'GIVING'
    | 'BEACON'
    | 'COMMUNITY'
    | 'LEADERSHIP'
    | 'SETTINGS';
  icon: LucideIcon;
  items: ModuleSubItem[];
}

export const moduleSidebarConfig: SidebarModule[] = [
  {
    title: 'CORE',
    icon: LayoutDashboard,
    items: [
      { label: 'Continue Editing', description: 'Jump back into your active teaching workflow immediately.', route: '/dashboard-ui', icon: Gauge },
      {
        label: 'Workflow Dashboard',
        description: 'Action-first dashboard for creating, editing, and publishing teachings.',
        route: '/faithhub/provider/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'CONTENT',
    icon: BookOpen,
    items: [
      {
        label: 'All Teachings',
        description: 'View all teachings by state and take the next action quickly.',
        route: '/faithhub/provider/teachings-dashboard',
        icon: BookOpen,
      },
      {
        label: 'Manage Content',
        description: 'Organize series, episodes, and draft structure for publishing.',
        route: '/faithhub/provider/series-dashboard',
        icon: FileText,
      },
      {
        label: 'Create Teaching Assets',
        description: 'Prepare notes, files, and support material for active teachings.',
        route: '/faithhub/provider/resources-manager',
        icon: FileText,
      },
    ],
  },
  {
    title: 'STREAM',
    icon: Video,
    items: [
      {
        label: 'Create Teaching Live',
        description: 'Prepare live teaching sessions and publishing metadata.',
        route: '/faithhub/provider/live-builder',
        icon: Video,
      },
      {
        label: 'Publish Schedule',
        description: 'Plan publish windows, reminders, and broadcast timing.',
        route: '/faithhub/provider/live-schedule',
        icon: CalendarDays,
      },
      {
        label: 'Publishing Monitor',
        description: 'Monitor delivery health and publishing outcomes in real time.',
        route: '/faithhub/provider/live-dashboard',
        icon: RadioTower,
      },
    ],
  },
  {
    title: 'OUTREACH',
    icon: Megaphone,
    items: [
      {
        label: 'Audience Notifications',
        description: 'Deliver targeted notices for devotionals, launches, and live moments.',
        route: '/faithhub/provider/audience-notifications',
        icon: Bell,
      },
      {
        label: 'Noticeboard',
        description: 'Publish broad community announcements and organizational alerts.',
        route: '/faithhub/provider/noticeboard',
        icon: Megaphone,
      },
    ],
  },
  {
    title: 'POST-LIVE',
    icon: PlayCircle,
    items: [
      {
        label: 'Post Live Publishing',
        description: 'Convert live sessions into polished replay-ready content packages.',
        route: '/faithhub/provider/post-live-publishing',
        icon: PlayCircle,
      },
      {
        label: 'Replays & Clips',
        description: 'Edit highlights and archive broadcasts for long-tail engagement.',
        route: '/faithhub/provider/replays-clips',
        icon: ChevronRight,
      },
    ],
  },
  {
    title: 'GIVING',
    icon: HandHeart,
    items: [
      {
        label: 'Donations & Funds',
        description: 'Track campaigns, giving channels, and donation allocation status.',
        route: '/faithhub/provider/donations-and-funds',
        icon: CircleDollarSign,
      },
      {
        label: 'Wallet & Payouts',
        description: 'Review balances, payout schedules, and transaction settlements.',
        route: '/faithhub/provider/wallet-payouts',
        icon: Wallet,
      },
    ],
  },
  {
    title: 'BEACON',
    icon: Sparkles,
    items: [
      {
        label: 'Beacon Dashboard',
        description: 'Control recommendation visibility and engagement performance trends.',
        route: '/faithhub/provider/beacon-dashboard',
        icon: Sparkles,
      },
      {
        label: 'Beacon Marketplace',
        description: 'Manage discoverability assets, slots, and campaign experiments.',
        route: '/faithhub/provider/beacon-marketplace',
        icon: Globe,
      },
    ],
  },
  {
    title: 'COMMUNITY',
    icon: Users,
    items: [
      {
        label: 'Community Groups',
        description: 'Coordinate member groups, hosts, and participation activity.',
        route: '/faithhub/provider/community-groups',
        icon: Users,
      },
      {
        label: 'Counseling',
        description: 'Support care journeys with guided follow-up and case visibility.',
        route: '/faithhub/provider/counseling',
        icon: HeartHandshake,
      },
    ],
  },
  {
    title: 'LEADERSHIP',
    icon: ShieldCheck,
    items: [
      {
        label: 'Roles & Permissions',
        description: 'Assign secure team access with role-based governance controls.',
        route: '/faithhub/provider/roles-permissions',
        icon: ShieldCheck,
      },
      {
        label: 'Serving Teams',
        description: 'Organize volunteer structures, rosters, and ministry ownership.',
        route: '/faithhub/provider/serving-teams',
        icon: Users,
      },
    ],
  },
  {
    title: 'SETTINGS',
    icon: Settings,
    items: [
      {
        label: 'Workspace Settings',
        description: 'Configure branding, preferences, and provider-level defaults.',
        route: '/faithhub/provider/workspace-settings',
        icon: Settings,
      },
      {
        label: 'Moderation Settings',
        description: 'Control safety filters, moderation queues, and trust policies.',
        route: '/faithhub/provider/moderation-settings',
        icon: MessageSquare,
      },
    ],
  },
];
