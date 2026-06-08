import { lazy, type LazyExoticComponent, type ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  BookText,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  FilePenLine,
  FolderKanban,
  HeartHandshake,
  Home,
  Megaphone,
  MessageSquare,
  Mic2,
  MonitorPlay,
  NotebookPen,
  Package,
  Radio,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
  Wrench,
  UserCircle2,
  Clapperboard,
} from 'lucide-react';

export type ProviderPageSection =
  | 'Foundation & Mission Control'
  | 'Content Structure & Teaching Creation'
  | 'Provider Journey'
  | 'Live Sessions Operations'
  | 'Audience & Outreach'
  | 'Post-live & Trust'
  | 'Events & Giving'
  | 'Revelight'
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
  navPlacement?: 'primary' | 'builder';
  parentKey?: string;
  hidden?: boolean;
  quickAction?: boolean;
  component: LazyExoticComponent<ComponentType>;
};

const lazyPage = (loader: Parameters<typeof lazy>[0]) => lazy(loader);

const ProviderOnboarding = lazyPage(() => import('@/pages/provider/raw/ProviderOnboarding'));
const ProviderDashboard = lazyPage(() => import('@/pages/provider/raw/ProviderDashboard'));
const SeriesDashboard = lazyPage(() => import('@/pages/provider/raw/SeriesDashboard'));
const TeachingsDashboard = lazyPage(() => import('@/pages/provider/raw/TeachingsDashboard'));
const SeriesBuilder = lazyPage(() => import('@/pages/provider/raw/SeriesBuilder'));
const EpisodeBuilder = lazyPage(() => import('@/pages/provider/raw/EpisodeBuilder'));
const StandaloneTeachingBuilder = lazyPage(() => import('@/pages/provider/raw/StandaloneTeachingBuilder'));
const BooksManager = lazyPage(() => import('@/pages/provider/raw/BooksManager'));
const BookBuilder = lazyPage(() => import('@/pages/provider/raw/BookBuilder'));
const ResourcesManager = lazyPage(() => import('@/pages/provider/raw/ResourcesManager'));
const ContentPlanner = lazyPage(() => import('@/pages/provider/raw/ContentPlanner'));
const MerchandiseManager = lazyPage(() => import('@/pages/provider/raw/MerchandiseManager'));
const MerchandiseBuilder = lazyPage(() => import('@/pages/provider/raw/MerchandiseBuilder'));
const LiveBuilder = lazyPage(() => import('@/pages/provider/raw/LiveBuilder'));
const LiveSchedule = lazyPage(() => import('@/pages/provider/raw/LiveSchedule'));
const LiveDashboard = lazyPage(() => import('@/pages/provider/raw/LiveDashboard'));
const LiveStudio = lazyPage(() => import('@/pages/provider/raw/LiveStudio'));
const StreamToPlatforms = lazyPage(() => import('@/pages/provider/raw/StreamToPlatforms'));
const AudienceNotifications = lazyPage(() => import('@/pages/provider/raw/AudienceNotifications'));
const ChannelsContactManager = lazyPage(() => import('@/pages/provider/raw/ChannelsContactManager'));
const Noticeboard = lazyPage(() => import('@/pages/provider/raw/Noticeboard'));
const PostLivePublishing = lazyPage(() => import('@/pages/provider/raw/PostLivePublishing'));
const ReplaysAndClips = lazyPage(() => import('@/pages/provider/raw/ReplaysAndClips'));
const EventsManager = lazyPage(() => import('@/pages/provider/raw/EventsManager'));
const DonationsAndFunds = lazyPage(() => import('@/pages/provider/raw/DonationsAndFunds'));
const CharityCrowdfundingWorkbench = lazyPage(() => import('@/pages/provider/raw/CharityCrowdfundingWorkbench'));
const WalletAndPayouts = lazyPage(() => import('@/pages/provider/raw/WalletAndPayouts'));
const ReviewsAndModeration = lazyPage(() => import('@/pages/provider/raw/ReviewsAndModeration'));
const RevelightDashboard = lazyPage(() => import('@/pages/provider/raw/RevelightDashboard'));
const RevelightMarketplace = lazyPage(() => import('@/pages/provider/raw/RevelightMarketplace'));
const RevelightManager = lazyPage(() => import('@/pages/provider/raw/RevelightManager'));
const RevelightBuilder = lazyPage(() => import('@/pages/provider/raw/RevelightBuilder'));
const CommunityGroups = lazyPage(() => import('@/pages/provider/raw/CommunityGroups'));
const PrayerRequests = lazyPage(() => import('@/pages/provider/raw/PrayerRequests'));
const Testimonies = lazyPage(() => import('@/pages/provider/raw/Testimonies'));
const PrayerJournal = lazyPage(() => import('@/pages/provider/raw/PrayerJournal'));
const CommunityForum = lazyPage(() => import('@/pages/provider/raw/CommunityForum'));
const Counseling = lazyPage(() => import('@/pages/provider/raw/Counseling'));
const Projects = lazyPage(() => import('@/pages/provider/raw/Projects'));
const Devotionals = lazyPage(() => import('@/pages/provider/raw/Devotionals'));
const Leadership = lazyPage(() => import('@/pages/provider/raw/Leadership'));
const ServingTeams = lazyPage(() => import('@/pages/provider/raw/ServingTeams'));
const RolesPermissions = lazyPage(() => import('@/pages/provider/raw/RolesPermissions'));
const Subscriptions = lazyPage(() => import('@/pages/provider/raw/Subscriptions'));
const WorkspaceSettings = lazyPage(() => import('@/pages/provider/raw/WorkspaceSettings'));
const ModerationSettings = lazyPage(() => import('@/pages/provider/raw/ModerationSettings'));
const AuditLog = lazyPage(() => import('@/pages/provider/raw/AuditLog'));
const QACenter = lazyPage(() => import('@/pages/provider/raw/QACenter'));
const ProfileSettings = lazyPage(() => import('@/pages/provider/ProfileSettingsPage'));
const ProviderShellPreview = lazyPage(() => import('@/pages/provider/previews/FaithHubProviderShellLightV3'));
const DesignSystemShowcase = lazyPage(() => import('@/pages/provider/previews/DesignSystemShowcase'));
const AnalyticsEventHealthPreview = lazyPage(() => import('@/pages/provider/previews/AnalyticsEventHealthPreview'));
const ServiceManagement = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.ServiceManagementPage })));
const ServiceBuilder = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.ServiceBuilderPage })));
const CampaignManagement = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.CampaignManagementPage })));
const CampaignBuilder = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.CampaignBuilderPage })));
const ContentUpload = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.ContentUploadPage })));
const AssetLibrary = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.AssetLibraryPage })));
const LiveSessionDetails = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.LiveSessionDetailsPage })));
const WaitingRoom = lazyPage(() => import('@/pages/provider/FaithHubProviderJourneyPages').then((module) => ({ default: module.WaitingRoomPage })));

export const providerPageCatalog: ProviderPageMeta[] = [
  {
    key: 'analytics-event-health',
    title: 'Analytics Event Health',
    description: 'Quick visibility into local analytics events and action logs for UX instrumentation QA.',
    path: '/faithhub/provider/analytics-event-health',
    section: 'Previews',
    icon: Sparkles,
    hidden: true,
    component: AnalyticsEventHealthPreview,
  },
  {
    key: 'design-system-showcase',
    title: 'Design System Showcase',
    description: 'Reference page for buttons, cards, spacing, typography, and interaction states.',
    path: '/faithhub/provider/design-system-showcase',
    section: 'Previews',
    icon: Sparkles,
    hidden: true,
    component: DesignSystemShowcase,
  },
  {
    key: 'provider-onboarding',
    title: 'FaithHub Provider Onboarding',
    description: 'Verification, brand setup, campus configuration, team roles, and launch readiness.',
    path: '/faithhub/provider/onboarding',
    section: 'Foundation & Mission Control',
    icon: ClipboardCheck,
    quickAction: true,
    component: ProviderOnboarding,
  },
  {
    key: 'provider-dashboard',
    title: 'FaithHub Provider Dashboard',
    description: 'Premium provider-side mission control with live, content, audience, giving, and Revelight signals.',
    path: '/faithhub/provider/dashboard',
    aliases: ['/faithhub/provider'],
    section: 'Foundation & Mission Control',
    icon: Home,
    quickAction: true,
    component: ProviderDashboard,
  },
  {
    key: 'service-management',
    title: 'Service Management',
    description: 'Track provider services, approval state, and the live-readiness of each offering.',
    path: '/faithhub/provider/services',
    section: 'Provider Journey',
    icon: Briefcase,
    component: ServiceManagement,
  },
  {
    key: 'service-builder',
    title: 'Create Service',
    description: 'Build a provider service with pricing, media, and approval details.',
    path: '/faithhub/provider/service-builder',
    section: 'Provider Journey',
    icon: Briefcase,
    navPlacement: 'builder',
    parentKey: 'service-management',
    quickAction: true,
    component: ServiceBuilder,
  },
  {
    key: 'campaign-management',
    title: 'Campaign Management',
    description: 'Review campaign windows, status, and associated provider services.',
    path: '/faithhub/provider/campaigns',
    section: 'Provider Journey',
    icon: Megaphone,
    component: CampaignManagement,
  },
  {
    key: 'campaign-builder',
    title: 'Create Campaign',
    description: 'Create a campaign around an objective, banner, and approved services.',
    path: '/faithhub/provider/campaign-builder',
    section: 'Provider Journey',
    icon: Megaphone,
    navPlacement: 'builder',
    parentKey: 'campaign-management',
    quickAction: true,
    component: CampaignBuilder,
  },
  {
    key: 'content-upload',
    title: 'Content Upload',
    description: 'Drag and drop posters, videos, banners, thumbnails, and flyers into review.',
    path: '/faithhub/provider/content-upload',
    section: 'Provider Journey',
    icon: FolderKanban,
    quickAction: true,
    component: ContentUpload,
  },
  {
    key: 'asset-library',
    title: 'Asset Library',
    description: 'Browse approved assets and select them for upcoming live sessions.',
    path: '/faithhub/provider/asset-library',
    section: 'Provider Journey',
    icon: FolderKanban,
    quickAction: true,
    component: AssetLibrary,
  },
  {
    key: 'series-dashboard',
    title: 'Series Dashboard',
    description: 'Structured overview of teaching campaigns, episodes, and launch readiness.',
    path: '/faithhub/provider/series-dashboard',
    section: 'Foundation & Mission Control',
    icon: FolderKanban,
    component: SeriesDashboard,
  },
  {
    key: 'teachings-dashboard',
    title: 'Teachings Dashboard',
    description: 'Unified view of series, episodes, and standalone teachings.',
    path: '/faithhub/provider/teachings-dashboard',
    section: 'Foundation & Mission Control',
    icon: Mic2,
    component: TeachingsDashboard,
  },
  {
    key: 'series-builder',
    title: 'Series Builder',
    description: 'Build premium teaching series with identity, resources, audience access, and launch planning.',
    path: '/faithhub/provider/series-builder',
    section: 'Content Structure & Teaching Creation',
    icon: BookText,
    navPlacement: 'builder',
    parentKey: 'teachings-dashboard',
    quickAction: true,
    component: SeriesBuilder,
  },
  {
    key: 'episode-builder',
    title: 'Episode Builder',
    description: 'Shape episode-level structure, resources, live attachments, and access rules.',
    path: '/faithhub/provider/episode-builder',
    section: 'Content Structure & Teaching Creation',
    icon: NotebookPen,
    navPlacement: 'builder',
    parentKey: 'teachings-dashboard',
    component: EpisodeBuilder,
  },
  {
    key: 'standalone-teaching-builder',
    title: 'Standalone Teaching Builder',
    description: 'Create sermons or teachings that live outside a series while preserving replay and promotion flows.',
    path: '/faithhub/provider/standalone-teaching-builder',
    section: 'Content Structure & Teaching Creation',
    icon: FilePenLine,
    navPlacement: 'builder',
    parentKey: 'teachings-dashboard',
    quickAction: true,
    component: StandaloneTeachingBuilder,
  },
  {
    key: 'books-manager',
    title: 'Books Manager',
    description: 'Manage book inventory, publishing assets, and resource library tie-ins.',
    path: '/faithhub/provider/books-manager',
    section: 'Content Structure & Teaching Creation',
    icon: BookOpen,
    component: BooksManager,
  },
  {
    key: 'book-builder',
    title: 'Book Builder',
    description: 'Create and package books with metadata, cover art, launch tasks, and promotion hooks.',
    path: '/faithhub/provider/book-builder',
    section: 'Content Structure & Teaching Creation',
    icon: BookText,
    navPlacement: 'builder',
    parentKey: 'books-manager',
    component: BookBuilder,
  },
  {
    key: 'resources-manager',
    title: 'Resources Manager',
    description: 'Manage downloadable notes, guides, handouts, and supporting teaching assets.',
    path: '/faithhub/provider/resources-manager',
    section: 'Content Structure & Teaching Creation',
    icon: FolderKanban,
    component: ResourcesManager,
  },
  {
    key: 'content-planner',
    title: 'Content Planner',
    description: 'Plan cycles, assign owners, and track readiness across teaching and publishing workflows.',
    path: '/faithhub/provider/content-planner',
    section: 'Content Structure & Teaching Creation',
    icon: CalendarDays,
    quickAction: true,
    component: ContentPlanner,
  },
  {
    key: 'merchandise-manager',
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
    title: 'Merchandise Builder',
    description: 'Create new merchandise listings with pricing, media, inventory, and cross-linking.',
    path: '/faithhub/provider/merchandise-builder',
    aliases: ['/faithhub/provider/new-merchandise'],
    section: 'Content Structure & Teaching Creation',
    icon: Package,
    navPlacement: 'builder',
    parentKey: 'merchandise-manager',
    component: MerchandiseBuilder,
  },
  {
    key: 'live-builder',
    title: 'Live Builder',
    description: 'Configure operational, editorial, and audience-facing settings for a live session.',
    path: '/faithhub/provider/live-builder',
    section: 'Live Sessions Operations',
    icon: Radio,
    navPlacement: 'builder',
    parentKey: 'live-dashboard',
    quickAction: true,
    component: LiveBuilder,
  },
  {
    key: 'live-schedule',
    title: 'Live Schedule',
    description: 'Operational calendar for live sessions, staffing, campuses, and readiness.',
    path: '/faithhub/provider/live-schedule',
    section: 'Live Sessions Operations',
    icon: CalendarClock,
    component: LiveSchedule,
  },
  {
    key: 'live-dashboard',
    title: 'Live Dashboard',
    description: 'High-intensity control room dashboard for specific sessions before and during broadcast.',
    path: '/faithhub/provider/live-dashboard',
    section: 'Live Sessions Operations',
    icon: MonitorPlay,
    quickAction: true,
    component: LiveDashboard,
  },
  {
    key: 'live-session-details',
    title: 'Live Session Details',
    description: 'Review the selected live session banner, host line-up, featured services, and preview entry.',
    path: '/faithhub/provider/live-session-details',
    section: 'Live Sessions Operations',
    icon: MonitorPlay,
    component: LiveSessionDetails,
  },
  {
    key: 'waiting-room',
    title: 'Waiting Room Preview',
    description: 'Preview the session waiting room with countdown, host information, and reminder actions.',
    path: '/faithhub/provider/waiting-room',
    section: 'Live Sessions Operations',
    icon: CalendarClock,
    component: WaitingRoom,
  },
  {
    key: 'live-studio',
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
    title: 'Stream-to-Platforms',
    description: 'Manage multi-destination routing, credentials, health, and fallback behavior.',
    path: '/faithhub/provider/stream-to-platforms',
    section: 'Live Sessions Operations',
    icon: Share2,
    component: StreamToPlatforms,
  },
  {
    key: 'audience-notifications',
    title: 'Audience Notifications',
    description: 'Build reminder and follow-up journeys for live sessions, replays, events, and giving.',
    path: '/faithhub/provider/audience-notifications',
    section: 'Audience & Outreach',
    icon: Bell,
    component: AudienceNotifications,
  },
  {
    key: 'channels-contact-manager',
    title: 'Channels & Contact Manager',
    description: 'Audience directory, segments, consent tracking, and messaging channel readiness.',
    path: '/faithhub/provider/channels-contact-manager',
    section: 'Audience & Outreach',
    icon: Users,
    component: ChannelsContactManager,
  },
  {
    key: 'noticeboard',
    title: 'Noticeboard',
    description: 'FaithHub Provider-wide notices, announcements, pinned moments, and communication highlights.',
    path: '/faithhub/provider/noticeboard',
    section: 'Audience & Outreach',
    icon: MessageSquare,
    component: Noticeboard,
  },
  {
    key: 'post-live-publishing',
    title: 'Post-live Publishing',
    description: 'Package replays with clean metadata, chapters, resources, and follow-up actions.',
    path: '/faithhub/provider/post-live-publishing',
    section: 'Post-live & Trust',
    icon: ClipboardCheck,
    component: PostLivePublishing,
  },
  {
    key: 'replays-and-clips',
    title: 'Replays & Clips',
    description: 'Manage replay library, extract clips, package variants, and connect them to growth surfaces.',
    path: '/faithhub/provider/replays-and-clips',
    aliases: ['/faithhub/provider/replays-clips', '/faithhub/replays/sunday-encounter'],
    section: 'Post-live & Trust',
    icon: Clapperboard,
    component: ReplaysAndClips,
  },
  {
    key: 'events-manager',
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
    title: 'Wallet & Payouts',
    description: 'Review balances, payout timing, and finance readiness for provider operations.',
    path: '/faithhub/provider/wallet-payouts',
    section: 'Events & Giving',
    icon: Wallet,
    component: WalletAndPayouts,
  },
  {
    key: 'reviews-and-moderation',
    title: 'Reviews & Moderation',
    description: 'Reputation management and moderation case handling across content, live, and campaigns.',
    path: '/faithhub/provider/reviews-and-moderation',
    aliases: ['/faithhub/provider/reviews-moderation'],
    section: 'Post-live & Trust',
    icon: ShieldCheck,
    component: ReviewsAndModeration,
  },
  {
    key: 'revelight-dashboard',
    title: 'Revelight Dashboard',
    description: 'Executive promotional control center for spend, reach, conversions, and recommendations.',
    path: '/faithhub/provider/revelight-dashboard',
    section: 'Revelight',
    icon: Megaphone,
    component: RevelightDashboard,
  },
  {
    key: 'revelight-marketplace',
    title: 'Revelight Marketplace',
    description: 'Browse and compare inventory, audience packages, and placement options before launch.',
    path: '/faithhub/provider/revelight-marketplace',
    section: 'Revelight',
    icon: ShoppingBag,
    component: RevelightMarketplace,
  },
  {
    key: 'revelight-manager',
    title: 'Revelight Manager',
    description: 'Monitor, optimize, approve, and steer campaigns after launch.',
    path: '/faithhub/provider/revelight-manager',
    section: 'Revelight',
    icon: Briefcase,
    component: RevelightManager,
  },
  {
    key: 'revelight-builder',
    title: 'Revelight Builder',
    description: 'Create linked or standalone Revelight campaigns with previews, budget, and placements.',
    path: '/faithhub/provider/revelight-builder',
    section: 'Revelight',
    icon: FilePenLine,
    navPlacement: 'builder',
    parentKey: 'revelight-manager',
    quickAction: true,
    component: RevelightBuilder,
  },
  {
    key: 'community-groups',
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
    title: 'Prayer Requests',
    description: 'Receive, triage, and respond to prayer requests with pastoral care signals.',
    path: '/faithhub/provider/prayer-requests',
    section: 'Community & Care',
    icon: HeartHandshake,
    component: PrayerRequests,
  },
  {
    key: 'testimonies',
    title: 'Testimonies',
    description: 'Review and publish testimonies with quality and safety checks.',
    path: '/faithhub/provider/testimonies',
    aliases: ['/faithhub/provider/testimonies/new'],
    section: 'Community & Care',
    icon: ClipboardCheck,
    component: Testimonies,
  },
  {
    key: 'prayer-journal',
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
    title: 'Projects',
    description: 'Track ministry projects, milestones, ownership, and execution health.',
    path: '/faithhub/provider/projects',
    aliases: ['/faithhub/provider/projects/new'],
    section: 'Community & Care',
    icon: FolderKanban,
    component: Projects,
  },
  {
    key: 'devotionals',
    title: 'Devotionals',
    description: 'Create devotional journeys that connect prayer, testimonies, and community groups.',
    path: '/faithhub/provider/devotionals',
    aliases: ['/faithhub/provider/devotionals/new'],
    section: 'Community & Care',
    icon: BookOpen,
    component: Devotionals,
  },
  {
    key: 'leadership',
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
    title: 'Roles & Permissions',
    description: 'Granular access control, approvals, and role visibility across the FaithHub Provider workspace.',
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
    title: 'Subscriptions',
    description: 'Subscription offerings, entitlements, plans, and lifecycle management.',
    path: '/faithhub/provider/subscriptions',
    section: 'Leadership & Team',
    icon: DollarSign,
    component: Subscriptions,
  },
  {
    key: 'workspace-settings',
    title: 'Workspace Settings',
    description: 'Global provider defaults for brand, locales, regions, and workspace behaviors.',
    path: '/faithhub/provider/workspace-settings',
    section: 'Workspace Settings',
    icon: Wrench,
    component: WorkspaceSettings,
  },
  {
    key: 'moderation-settings',
    title: 'Moderation Settings',
    description: 'Fine-tune moderation thresholds, policy defaults, and safety switches.',
    path: '/faithhub/provider/moderation-settings',
    section: 'Workspace Settings',
    icon: ShieldCheck,
    component: ModerationSettings,
  },
  {
    key: 'audit-log',
    title: 'Audit Log',
    description: 'Review workspace activity history, who changed what, and operational evidence.',
    path: '/faithhub/provider/audit-log',
    section: 'Workspace Settings',
    icon: ClipboardCheck,
    component: AuditLog,
  },
  {
    key: 'qa-center',
    title: 'QA Center',
    description: 'Quality assurance checkpoints, test tasks, and readiness review surfaces.',
    path: '/faithhub/provider/qa-center',
    section: 'Workspace Settings',
    icon: ClipboardCheck,
    component: QACenter,
  },
  {
    key: 'profile-settings',
    title: 'Profile Settings',
    shortTitle: 'Profile',
    description: 'Signed-in account identity, role context, and active workspace profile.',
    path: '/faithhub/provider/profile-settings',
    section: 'Workspace Settings',
    icon: UserCircle2,
    hidden: true,
    component: ProfileSettings,
  },
  {
    key: 'provider-shell-preview',
    title: 'FaithHub Provider Shell Preview',
    description: 'Original shell preview attached to the project inputs.',
    path: '/faithhub/provider/preview-shell',
    section: 'Previews',
    icon: Home,
    hidden: true,
    component: ProviderShellPreview,
  },
];




