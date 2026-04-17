import { lazy, type LazyExoticComponent, type ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  BookText,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardCheck,
  DollarSign,
  FilePenLine,
  FolderKanban,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LibraryBig,
  Megaphone,
  MessageSquare,
  Mic2,
  MonitorPlay,
  NotebookPen,
  Package,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';

export type ProviderPageSection =
  | 'Foundation & Mission Control'
  | 'Content Structure & Teaching Creation'
  | 'Live Sessions Operations'
  | 'Audience & Outreach'
  | 'Post-live & Trust'
  | 'Events & Giving'
  | 'Beacon'
  | 'Community & Care'
  | 'Leadership & Team'
  | 'Workspace Settings'
  | 'Previews';

export type ProviderPageMeta = {
  key: string;
  id?: string;
  title: string;
  shortTitle?: string;
  description: string;
  path: string;
  aliases?: string[];
  section: ProviderPageSection;
  icon: LucideIcon;
  hidden?: boolean;
  quickAction?: boolean;
  component: LazyExoticComponent<ComponentType>;
};

const lazyPage = (loader: Parameters<typeof lazy>[0]) => lazy(loader);

const ProviderOnboarding = lazyPage(() => import('@/pages/provider/raw/FH-P-001_ProviderOnboarding'));
const ProviderDashboard = lazyPage(() => import('@/pages/provider/raw/FH-P-010_ProviderDashboard'));
const SeriesDashboard = lazyPage(() => import('@/pages/provider/raw/FH-P-018_SeriesDashboard'));
const TeachingsDashboard = lazyPage(() => import('@/pages/provider/raw/FH-P-019_TeachingsDashboard'));
const SeriesBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-020_SeriesBuilder'));
const EpisodeBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-021_EpisodeBuilder'));
const StandaloneTeachingBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-022_StandaloneTeachingBuilder'));
const BooksManager = lazyPage(() => import('@/pages/provider/raw/FH-P-023_BooksManager'));
const BookBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-024_BookBuilder'));
const ResourcesManager = lazyPage(() => import('@/pages/provider/raw/FH-P-025_ResourcesManager'));
const MerchandiseManager = lazyPage(() => import('@/pages/provider/raw/FH-P-026_MerchandiseManager'));
const MerchandiseBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-027_MerchandiseBuilder'));
const LiveBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-030_LiveBuilder'));
const LiveSchedule = lazyPage(() => import('@/pages/provider/raw/FH-P-031_LiveSchedule'));
const LiveDashboard = lazyPage(() => import('@/pages/provider/raw/FH-P-032_LiveDashboard'));
const LiveStudio = lazyPage(() => import('@/pages/provider/raw/FH-P-033_LiveStudio'));
const StreamToPlatforms = lazyPage(() => import('@/pages/provider/raw/FH-P-034_StreamToPlatforms'));
const AudienceNotifications = lazyPage(() => import('@/pages/provider/raw/FH-P-035_AudienceNotifications'));
const ChannelsContactManager = lazyPage(() => import('@/pages/provider/raw/FH-P-036_ChannelsContactManager'));
const Noticeboard = lazyPage(() => import('@/pages/provider/raw/FH-P-037_Noticeboard'));
const PostLivePublishing = lazyPage(() => import('@/pages/provider/raw/FH-P-040_PostLivePublishing'));
const ReplaysAndClips = lazyPage(() => import('@/pages/provider/raw/FH-P-041_ReplaysAndClips'));
const EventsManager = lazyPage(() => import('@/pages/provider/raw/FH-P-050_EventsManager'));
const DonationsAndFunds = lazyPage(() => import('@/pages/provider/raw/FH-P-060_DonationsAndFunds'));
const CharityCrowdfundingWorkbench = lazyPage(() => import('@/pages/provider/raw/FH-P-061_CharityCrowdfundingWorkbench'));
const WalletAndPayouts = lazyPage(() => import('@/pages/provider/raw/FH-P-062_WalletAndPayouts'));
const ReviewsAndModeration = lazyPage(() => import('@/pages/provider/raw/FH-P-070_ReviewsAndModeration'));
const BeaconDashboard = lazyPage(() => import('@/pages/provider/raw/FH-P-080_BeaconDashboard'));
const BeaconMarketplace = lazyPage(() => import('@/pages/provider/raw/FH-P-081_BeaconMarketplace'));
const BeaconManager = lazyPage(() => import('@/pages/provider/raw/FH-P-082_BeaconManager'));
const BeaconBuilder = lazyPage(() => import('@/pages/provider/raw/FH-P-083_BeaconBuilder'));
const CommunityGroups = lazyPage(() => import('@/pages/provider/raw/FH-P-100_CommunityGroups'));
const PrayerRequests = lazyPage(() => import('@/pages/provider/raw/FH-P-101_PrayerRequests_regenerated'));
const Testimonies = lazyPage(() => import('@/pages/provider/raw/FH-P-102_Testimonies'));
const PrayerJournal = lazyPage(() => import('@/pages/provider/raw/FH-P-103_PrayerJournal'));
const CommunityForum = lazyPage(() => import('@/pages/provider/raw/FH-P-104_CommunityForum'));
const Counseling = lazyPage(() => import('@/pages/provider/raw/FH-P-105_Counseling'));
const Projects = lazyPage(() => import('@/pages/provider/raw/FH-P-106_Projects'));
const Leadership = lazyPage(() => import('@/pages/provider/raw/FH-P-110_Leadership'));
const ServingTeams = lazyPage(() => import('@/pages/provider/raw/FH-P-111_ServingTeams'));
const RolesPermissions = lazyPage(() => import('@/pages/provider/raw/FH-P-112_RolesPermissions'));
const Subscriptions = lazyPage(() => import('@/pages/provider/raw/FH-P-113_Subscriptions'));
const WorkspaceSettings = lazyPage(() => import('@/pages/provider/raw/FH-P-120_WorkspaceSettings'));
const ModerationSettings = lazyPage(() => import('@/pages/provider/raw/FH-P-121_ModerationSettings'));
const AuditLog = lazyPage(() => import('@/pages/provider/raw/FH-P-122_AuditLog'));
const QACenter = lazyPage(() => import('@/pages/provider/raw/FH-P-123_QACenter'));
const ProviderShellPreview = lazyPage(() => import('@/pages/provider/previews/FaithHubProviderShellLightV3'));

export const providerPageCatalog: ProviderPageMeta[] = [
  {
    key: 'provider-onboarding',
    id: 'FH-P-001',
    title: 'Provider Onboarding',
    description: 'Verification, brand setup, campus configuration, team roles, and launch readiness.',
    path: '/faithhub/provider/onboarding',
    section: 'Foundation & Mission Control',
    icon: BadgeCheck,
    quickAction: true,
    component: ProviderOnboarding,
  },
  {
    key: 'provider-dashboard',
    id: 'FH-P-010',
    title: 'Provider Dashboard',
    description: 'Premium provider-side mission control with live, content, audience, giving, and Beacon signals.',
    path: '/faithhub/provider/dashboard',
    aliases: ['/faithhub/provider'],
    section: 'Foundation & Mission Control',
    icon: LayoutDashboard,
    quickAction: true,
    component: ProviderDashboard,
  },
  {
    key: 'series-dashboard',
    id: 'FH-P-018',
    title: 'Series Dashboard',
    description: 'Structured overview of teaching campaigns, episodes, and launch readiness.',
    path: '/faithhub/provider/series-dashboard',
    section: 'Foundation & Mission Control',
    icon: LibraryBig,
    component: SeriesDashboard,
  },
  {
    key: 'teachings-dashboard',
    id: 'FH-P-019',
    title: 'Teachings Dashboard',
    description: 'Unified view of series, episodes, and standalone teachings.',
    path: '/faithhub/provider/teachings-dashboard',
    section: 'Foundation & Mission Control',
    icon: BookOpen,
    component: TeachingsDashboard,
  },
  {
    key: 'series-builder',
    id: 'FH-P-020',
    title: 'Series Builder',
    description: 'Build premium teaching series with identity, resources, audience access, and launch planning.',
    path: '/faithhub/provider/series-builder',
    section: 'Content Structure & Teaching Creation',
    icon: BookText,
    quickAction: true,
    component: SeriesBuilder,
  },
  {
    key: 'episode-builder',
    id: 'FH-P-021',
    title: 'Episode Builder',
    description: 'Shape episode-level structure, resources, live attachments, and access rules.',
    path: '/faithhub/provider/episode-builder',
    section: 'Content Structure & Teaching Creation',
    icon: NotebookPen,
    component: EpisodeBuilder,
  },
  {
    key: 'standalone-teaching-builder',
    id: 'FH-P-022',
    title: 'Standalone Teaching Builder',
    description: 'Create sermons or teachings that live outside a series while preserving replay and promotion flows.',
    path: '/faithhub/provider/standalone-teaching-builder',
    section: 'Content Structure & Teaching Creation',
    icon: FilePenLine,
    quickAction: true,
    component: StandaloneTeachingBuilder,
  },
  {
    key: 'books-manager',
    id: 'FH-P-023',
    title: 'Books Manager',
    description: 'Manage book inventory, publishing assets, and resource library tie-ins.',
    path: '/faithhub/provider/books-manager',
    section: 'Content Structure & Teaching Creation',
    icon: BookOpen,
    component: BooksManager,
  },
  {
    key: 'book-builder',
    id: 'FH-P-024',
    title: 'Book Builder',
    description: 'Create and package books with metadata, cover art, launch tasks, and promotion hooks.',
    path: '/faithhub/provider/book-builder',
    section: 'Content Structure & Teaching Creation',
    icon: BookText,
    component: BookBuilder,
  },
  {
    key: 'resources-manager',
    id: 'FH-P-025',
    title: 'Resources Manager',
    description: 'Manage downloadable notes, guides, handouts, and supporting teaching assets.',
    path: '/faithhub/provider/resources-manager',
    section: 'Content Structure & Teaching Creation',
    icon: FolderKanban,
    component: ResourcesManager,
  },
  {
    key: 'merchandise-manager',
    id: 'FH-P-026',
    title: 'Merchandise Manager',
    description: 'Oversee products, availability, linked teachings, and FaithMart cross-sells.',
    path: '/faithhub/provider/merchandise-manager',
    aliases: ['/faithhub/provider/merchandise'],
    section: 'Content Structure & Teaching Creation',
    icon: ShoppingBag,
    component: MerchandiseManager,
  },
  {
    key: 'merchandise-builder',
    id: 'FH-P-027',
    title: 'Merchandise Builder',
    description: 'Create new merchandise listings with pricing, media, inventory, and cross-linking.',
    path: '/faithhub/provider/merchandise-builder',
    aliases: ['/faithhub/provider/new-merchandise'],
    section: 'Content Structure & Teaching Creation',
    icon: Package,
    component: MerchandiseBuilder,
  },
  {
    key: 'live-builder',
    id: 'FH-P-030',
    title: 'Live Builder',
    description: 'Configure operational, editorial, and audience-facing settings for a live session.',
    path: '/faithhub/provider/live-builder',
    section: 'Live Sessions Operations',
    icon: Radio,
    quickAction: true,
    component: LiveBuilder,
  },
  {
    key: 'live-schedule',
    id: 'FH-P-031',
    title: 'Live Schedule',
    description: 'Operational calendar for live sessions, staffing, campuses, and readiness.',
    path: '/faithhub/provider/live-schedule',
    section: 'Live Sessions Operations',
    icon: CalendarClock,
    component: LiveSchedule,
  },
  {
    key: 'live-dashboard',
    id: 'FH-P-032',
    title: 'Live Dashboard',
    description: 'High-intensity control room dashboard for specific sessions before and during broadcast.',
    path: '/faithhub/provider/live-dashboard',
    section: 'Live Sessions Operations',
    icon: MonitorPlay,
    quickAction: true,
    component: LiveDashboard,
  },
  {
    key: 'live-studio',
    id: 'FH-P-033',
    title: 'Live Studio',
    description: 'Premium production studio with scenes, overlays, backstage, captions, and controls.',
    path: '/faithhub/provider/live-studio',
    section: 'Live Sessions Operations',
    icon: Mic2,
    quickAction: true,
    component: LiveStudio,
  },
  {
    key: 'stream-to-platforms',
    id: 'FH-P-034',
    title: 'Stream-to-Platforms',
    description: 'Manage multi-destination routing, credentials, health, and fallback behavior.',
    path: '/faithhub/provider/stream-to-platforms',
    section: 'Live Sessions Operations',
    icon: Sparkles,
    component: StreamToPlatforms,
  },
  {
    key: 'audience-notifications',
    id: 'FH-P-035',
    title: 'Audience Notifications',
    description: 'Build reminder and follow-up journeys for live sessions, replays, events, and giving.',
    path: '/faithhub/provider/audience-notifications',
    section: 'Audience & Outreach',
    icon: Bell,
    component: AudienceNotifications,
  },
  {
    key: 'channels-contact-manager',
    id: 'FH-P-036',
    title: 'Channels & Contact Manager',
    description: 'Audience directory, segments, consent tracking, and messaging channel readiness.',
    path: '/faithhub/provider/channels-contact-manager',
    section: 'Audience & Outreach',
    icon: Users,
    component: ChannelsContactManager,
  },
  {
    key: 'noticeboard',
    id: 'FH-P-037',
    title: 'Noticeboard',
    description: 'Provider-wide notices, announcements, pinned moments, and communication highlights.',
    path: '/faithhub/provider/noticeboard',
    section: 'Audience & Outreach',
    icon: MessageSquare,
    component: Noticeboard,
  },
  {
    key: 'post-live-publishing',
    id: 'FH-P-040',
    title: 'Post-live Publishing',
    description: 'Package replays with clean metadata, chapters, resources, and follow-up actions.',
    path: '/faithhub/provider/post-live-publishing',
    section: 'Post-live & Trust',
    icon: MonitorPlay,
    component: PostLivePublishing,
  },
  {
    key: 'replays-and-clips',
    id: 'FH-P-041',
    title: 'Replays & Clips',
    description: 'Manage replay library, extract clips, package variants, and connect them to growth surfaces.',
    path: '/faithhub/provider/replays-and-clips',
    aliases: ['/faithhub/provider/replays-clips', '/faithhub/replays/sunday-encounter'],
    section: 'Post-live & Trust',
    icon: MonitorPlay,
    component: ReplaysAndClips,
  },
  {
    key: 'events-manager',
    id: 'FH-P-050',
    title: 'Events Manager',
    description: 'Plan services, conferences, trips, and classes with logistics, attendance, and promotion hooks.',
    path: '/faithhub/provider/events-manager',
    section: 'Events & Giving',
    icon: CalendarClock,
    quickAction: true,
    component: EventsManager,
  },
  {
    key: 'donations-and-funds',
    id: 'FH-P-060',
    title: 'Donations & Funds',
    description: 'Manage giving funds, campaigns, donor journeys, and transparency settings.',
    path: '/faithhub/provider/donations-and-funds',
    aliases: ['/faithhub/provider/donations-funds'],
    section: 'Events & Giving',
    icon: HeartHandshake,
    quickAction: true,
    component: DonationsAndFunds,
  },
  {
    key: 'charity-crowdfunding-workbench',
    id: 'FH-P-061',
    title: 'Charity Crowdfunding Workbench',
    description: 'Run goal-driven charity campaigns with milestones, updates, proof of impact, and momentum mechanics.',
    path: '/faithhub/provider/charity-crowdfunding-workbench',
    aliases: ['/faithhub/provider/charity-crowdfund'],
    section: 'Events & Giving',
    icon: HeartHandshake,
    component: CharityCrowdfundingWorkbench,
  },
  {
    key: 'wallet-and-payouts',
    id: 'FH-P-062',
    title: 'Wallet & Payouts',
    description: 'Review balances, payout timing, and finance readiness for provider operations.',
    path: '/faithhub/provider/wallet-payouts',
    section: 'Events & Giving',
    icon: Wallet,
    component: WalletAndPayouts,
  },
  {
    key: 'reviews-and-moderation',
    id: 'FH-P-070',
    title: 'Reviews & Moderation',
    description: 'Reputation management and moderation case handling across content, live, and campaigns.',
    path: '/faithhub/provider/reviews-and-moderation',
    aliases: ['/faithhub/provider/reviews-moderation'],
    section: 'Post-live & Trust',
    icon: ShieldCheck,
    component: ReviewsAndModeration,
  },
  {
    key: 'beacon-dashboard',
    id: 'FH-P-080',
    title: 'Beacon Dashboard',
    description: 'Executive promotional control center for spend, reach, conversions, and recommendations.',
    path: '/faithhub/provider/beacon-dashboard',
    section: 'Beacon',
    icon: Megaphone,
    component: BeaconDashboard,
  },
  {
    key: 'beacon-marketplace',
    id: 'FH-P-081',
    title: 'Beacon Marketplace',
    description: 'Browse and compare inventory, audience packages, and placement options before launch.',
    path: '/faithhub/provider/beacon-marketplace',
    section: 'Beacon',
    icon: ShoppingBag,
    component: BeaconMarketplace,
  },
  {
    key: 'beacon-manager',
    id: 'FH-P-082',
    title: 'Beacon Manager',
    description: 'Monitor, optimize, approve, and steer campaigns after launch.',
    path: '/faithhub/provider/beacon-manager',
    section: 'Beacon',
    icon: Briefcase,
    component: BeaconManager,
  },
  {
    key: 'beacon-builder',
    id: 'FH-P-083',
    title: 'Beacon Builder',
    description: 'Create linked or standalone Beacon campaigns with previews, budget, and placements.',
    path: '/faithhub/provider/beacon-builder',
    section: 'Beacon',
    icon: Sparkles,
    quickAction: true,
    component: BeaconBuilder,
  },
  {
    key: 'community-groups',
    id: 'FH-P-100',
    title: 'Community Groups',
    description: 'Manage groups, membership, and communal engagement workflows.',
    path: '/faithhub/provider/community-groups',
    aliases: ['/faithhub/provider/community-groups/new'],
    section: 'Community & Care',
    icon: Users,
    component: CommunityGroups,
  },
  {
    key: 'prayer-requests',
    id: 'FH-P-101',
    title: 'Prayer Requests',
    description: 'Receive, triage, and respond to prayer requests with pastoral care signals.',
    path: '/faithhub/provider/prayer-requests',
    section: 'Community & Care',
    icon: HeartHandshake,
    component: PrayerRequests,
  },
  {
    key: 'testimonies',
    id: 'FH-P-102',
    title: 'Testimonies',
    description: 'Review and publish testimonies with quality and safety checks.',
    path: '/faithhub/provider/testimonies',
    aliases: ['/faithhub/provider/testimonies/new'],
    section: 'Community & Care',
    icon: Sparkles,
    component: Testimonies,
  },
  {
    key: 'prayer-journal',
    id: 'FH-P-103',
    title: 'Prayer Journal',
    description: 'Track prayer entries, reflections, follow-ups, and care moments.',
    path: '/faithhub/provider/prayer-journal',
    aliases: ['/faithhub/provider/prayer-journal/new'],
    section: 'Community & Care',
    icon: NotebookPen,
    component: PrayerJournal,
  },
  {
    key: 'community-forum',
    id: 'FH-P-104',
    title: 'Community Forum',
    description: 'Moderate and grow ongoing discussions and community threads.',
    path: '/faithhub/provider/community-forum',
    aliases: ['/faithhub/provider/community-forum/new-topic'],
    section: 'Community & Care',
    icon: MessageSquare,
    component: CommunityForum,
  },
  {
    key: 'counseling',
    id: 'FH-P-105',
    title: 'Counseling',
    description: 'Coordinate counseling requests, sessions, notes, and pastoral care tasks.',
    path: '/faithhub/provider/counseling',
    aliases: ['/faithhub/provider/counseling/new'],
    section: 'Community & Care',
    icon: HeartHandshake,
    component: Counseling,
  },
  {
    key: 'projects',
    id: 'FH-P-106',
    title: 'Projects',
    description: 'Track ministry projects, milestones, ownership, and execution health.',
    path: '/faithhub/provider/projects',
    aliases: ['/faithhub/provider/projects/new'],
    section: 'Community & Care',
    icon: FolderKanban,
    component: Projects,
  },
  {
    key: 'leadership',
    id: 'FH-P-110',
    title: 'Leadership',
    description: 'Leadership roster, offices, planning, and decision support surfaces.',
    path: '/faithhub/provider/leadership',
    aliases: [
      '/faithhub/provider/leadership/new',
      '/faithhub/provider/leadership/assign-office',
      '/faithhub/provider/leadership/publish',
    ],
    section: 'Leadership & Team',
    icon: Building2,
    component: Leadership,
  },
  {
    key: 'serving-teams',
    id: 'FH-P-111',
    title: 'Serving Teams',
    description: 'Coordinate teams, invites, rotas, and volunteer coverage.',
    path: '/faithhub/provider/serving-teams',
    aliases: [
      '/faithhub/provider/serving-teams/new',
      '/faithhub/provider/serving-teams/rota',
      '/faithhub/provider/serving-teams/invite',
    ],
    section: 'Leadership & Team',
    icon: Users,
    component: ServingTeams,
  },
  {
    key: 'roles-permissions',
    id: 'FH-P-112',
    title: 'Roles & Permissions',
    description: 'Granular access control, approvals, and role visibility across the provider workspace.',
    path: '/faithhub/provider/roles-permissions',
    aliases: [
      '/faithhub/provider/roles-permissions/new',
      '/faithhub/provider/roles-permissions/review',
    ],
    section: 'Leadership & Team',
    icon: ShieldCheck,
    component: RolesPermissions,
  },
  {
    key: 'subscriptions',
    id: 'FH-P-113',
    title: 'Subscriptions',
    description: 'Subscription offerings, entitlements, plans, and lifecycle management.',
    path: '/faithhub/provider/subscriptions',
    section: 'Leadership & Team',
    icon: DollarSign,
    component: Subscriptions,
  },
  {
    key: 'workspace-settings',
    id: 'FH-P-120',
    title: 'Workspace Settings',
    description: 'Global provider defaults for brand, locales, regions, and workspace behaviors.',
    path: '/faithhub/provider/workspace-settings',
    section: 'Workspace Settings',
    icon: Wrench,
    component: WorkspaceSettings,
  },
  {
    key: 'moderation-settings',
    id: 'FH-P-121',
    title: 'Moderation Settings',
    description: 'Fine-tune moderation thresholds, policy defaults, and safety switches.',
    path: '/faithhub/provider/moderation-settings',
    section: 'Workspace Settings',
    icon: ShieldCheck,
    component: ModerationSettings,
  },
  {
    key: 'audit-log',
    id: 'FH-P-122',
    title: 'Audit Log',
    description: 'Review workspace activity history, who changed what, and operational evidence.',
    path: '/faithhub/provider/audit-log',
    section: 'Workspace Settings',
    icon: ClipboardCheck,
    component: AuditLog,
  },
  {
    key: 'qa-center',
    id: 'FH-P-123',
    title: 'QA Center',
    description: 'Quality assurance checkpoints, test tasks, and readiness review surfaces.',
    path: '/faithhub/provider/qa-center',
    section: 'Workspace Settings',
    icon: ClipboardCheck,
    component: QACenter,
  },
  {
    key: 'provider-shell-preview',
    title: 'Provider Shell Preview',
    description: 'Original shell preview attached to the project inputs.',
    path: '/faithhub/provider/preview-shell',
    section: 'Previews',
    icon: Home,
    hidden: true,
    component: ProviderShellPreview,
  },
];
