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
import { providerRoutes } from './providerRoutes';

export interface ModuleSubItem {
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
}

export interface SidebarModule {
  title:
    | 'CONTINUE'
    | 'CREATE'
    | 'PUBLISH'
    | 'PROMOTE'
    | 'REFINE'
    | 'MEASURE'
    | 'DISCOVER'
    | 'COMMUNITY'
    | 'TEAM'
    | 'SETTINGS';
  icon: LucideIcon;
  items: ModuleSubItem[];
}

export const moduleSidebarConfig: SidebarModule[] = [
  {
    title: 'CONTINUE',
    icon: LayoutDashboard,
    items: [
      { label: 'Continue Editing', description: 'Jump back into your active teaching workflow immediately.', route: providerRoutes.dashboardUi, icon: Gauge },
      {
        label: 'Workflow Dashboard',
        description: 'Action-first dashboard for creating, editing, and publishing teachings.',
        route: providerRoutes.dashboard,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'CREATE',
    icon: BookOpen,
    items: [
      {
        label: 'All Teachings',
        description: 'View all teachings by state and take the next action quickly.',
        route: providerRoutes.teachingsDashboard,
        icon: BookOpen,
      },
      {
        label: 'Manage Content',
        description: 'Organize series, episodes, and draft structure for publishing.',
        route: providerRoutes.seriesDashboard,
        icon: FileText,
      },
      {
        label: 'Create Teaching Assets',
        description: 'Prepare notes, files, and support material for active teachings.',
        route: providerRoutes.resourcesManager,
        icon: FileText,
      },
    ],
  },
  {
    title: 'PUBLISH',
    icon: Video,
    items: [
      {
        label: 'Create Teaching Live',
        description: 'Prepare live teaching sessions and publishing metadata.',
        route: providerRoutes.liveBuilder,
        icon: Video,
      },
      {
        label: 'Publish Schedule',
        description: 'Plan publish windows, reminders, and broadcast timing.',
        route: providerRoutes.liveSchedule,
        icon: CalendarDays,
      },
      {
        label: 'Publishing Monitor',
        description: 'Monitor delivery health and publishing outcomes in real time.',
        route: providerRoutes.liveDashboard,
        icon: RadioTower,
      },
    ],
  },
  {
    title: 'PROMOTE',
    icon: Megaphone,
    items: [
      {
        label: 'Audience Notifications',
        description: 'Deliver targeted notices for devotionals, launches, and live moments.',
        route: providerRoutes.audienceNotifications,
        icon: Bell,
      },
      {
        label: 'Noticeboard',
        description: 'Publish broad community announcements and organizational alerts.',
        route: providerRoutes.noticeboard,
        icon: Megaphone,
      },
    ],
  },
  {
    title: 'REFINE',
    icon: PlayCircle,
    items: [
      {
        label: 'Post Live Publishing',
        description: 'Convert live sessions into polished replay-ready content packages.',
        route: providerRoutes.postLivePublishing,
        icon: PlayCircle,
      },
      {
        label: 'Replays & Clips',
        description: 'Edit highlights and archive broadcasts for long-tail engagement.',
        route: providerRoutes.replaysAndClips,
        icon: ChevronRight,
      },
    ],
  },
  {
    title: 'MEASURE',
    icon: HandHeart,
    items: [
      {
        label: 'Donations & Funds',
        description: 'Track campaigns, giving channels, and donation allocation status.',
        route: providerRoutes.donationsAndFunds,
        icon: CircleDollarSign,
      },
      {
        label: 'Wallet & Payouts',
        description: 'Review balances, payout schedules, and transaction settlements.',
        route: providerRoutes.walletPayouts,
        icon: Wallet,
      },
    ],
  },
  {
    title: 'DISCOVER',
    icon: Sparkles,
    items: [
      {
        label: 'Revelight Dashboard',
        description: 'Control recommendation visibility and engagement performance trends.',
        route: providerRoutes.revelightDashboard,
        icon: Sparkles,
      },
      {
        label: 'Revelight Marketplace',
        description: 'Manage discoverability assets, slots, and campaign experiments.',
        route: providerRoutes.revelightMarketplace,
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
        route: providerRoutes.communityGroups,
        icon: Users,
      },
      {
        label: 'Prayer Wall',
        description: 'Receive and triage prayer requests with trusted pastoral follow-up.',
        route: providerRoutes.prayerRequests,
        icon: HeartHandshake,
      },
      {
        label: 'Testimonies',
        description: 'Review and publish approved testimony stories safely and consistently.',
        route: providerRoutes.testimonies,
        icon: Sparkles,
      },
      {
        label: 'Devotionals',
        description: 'Run devotional rhythms that connect livestream, prayer, and community.',
        route: providerRoutes.devotionals,
        icon: BookOpen,
      },
      {
        label: 'Counseling',
        description: 'Support care journeys with guided follow-up and case visibility.',
        route: providerRoutes.counseling,
        icon: HeartHandshake,
      },
    ],
  },
  {
    title: 'TEAM',
    icon: ShieldCheck,
    items: [
      {
        label: 'Roles & Permissions',
        description: 'Assign secure team access with role-based governance controls.',
        route: providerRoutes.rolesPermissions,
        icon: ShieldCheck,
      },
      {
        label: 'Serving Teams',
        description: 'Organize volunteer structures, rosters, and ministry ownership.',
        route: providerRoutes.servingTeams,
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
        route: providerRoutes.workspaceSettings,
        icon: Settings,
      },
      {
        label: 'Moderation Settings',
        description: 'Control safety filters, moderation queues, and trust policies.',
        route: providerRoutes.moderationSettings,
        icon: MessageSquare,
      },
    ],
  },
];
