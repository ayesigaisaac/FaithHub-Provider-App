import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Globe,
  Heart,
  HeartHandshake,
  MessageCircle,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  MessageSquareHeart,
  Building2,
  BellRing,
  Languages,
  Mail,
  Palette,
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme/ThemeModeToggle";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { getStoredToken, getStoredWorkspace } from "@/auth/storage";
import { localLiveSessionsApi } from "@/api/live/localLiveSessionsApi";
import type { LiveFlowRecord } from "@/features/live/liveFlowStore";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true, amount: 0.2 },
};

const brandMessaging = {
  productName: "FaithHub",
  poweredBy: "Powered by EVzone",
  heroLabel: "Provider Ministry Platform",
  heroTitle: "Run livestream, prayer, teachings, and care from one provider workspace.",
  heroBody:
    "FaithHub helps provider teams run daily ministry operations in one place: stream services, host prayer rooms, publish teachings, coordinate community follow-up, and keep trusted workflows moving without tool-switching.",
  platformSectionBody:
    "FaithHub is a faith streaming ecosystem that combines spiritual warmth with operational clarity, so teams can move from livestream to prayer, from worship to follow-up, and from message to meaningful community action without switching tools.",
  audienceSectionBody:
    "From local congregations to global prayer networks and digital worship communities, FaithHub provides a trusted foundation for real connection, consistency, and follow-through.",
  finalCtaTitle: "Launch your ministry presence on FaithHub.",
  finalCtaBody:
    "Bring livestreams, prayer moments, worship experiences, and community care into one clear, high-trust digital home your team can steward confidently.",
  footerBody:
    "FaithHub is the faith streaming ecosystem for communities that want to livestream, pray, worship, and build connected community with confidence.",
};

const stats = [
  { value: "2,400+", label: "Live worship communities" },
  { value: "320K+", label: "Prayer interactions monthly" },
  { value: "90+", label: "Nations connected" },
  { value: "120K+", label: "Livestream moments delivered" },
];

const defaultLiveNowStreams = [
  {
    id: "live-1",
    title: "Morning Worship & Prayer",
    campus: "Kampala Central",
    viewers: 18420,
    reactions: 3921,
    prayerResponses: 614,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "live-2",
    title: "Midweek Bible Teaching",
    campus: "Online Studio",
    viewers: 7290,
    reactions: 1184,
    prayerResponses: 242,
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "live-3",
    title: "Youth Worship Night",
    campus: "East Campus",
    viewers: 4310,
    reactions: 967,
    prayerResponses: 188,
    image:
      "https://images.unsplash.com/photo-1464375117522-1311dd7d0b44?auto=format&fit=crop&w=1400&q=80",
  },
];

const streamDiscoveryCategories = [
  { key: "worship", label: "Worship", hint: "Live worship nights and praise sessions", route: "/faithhub/provider/live-dashboard" },
  { key: "prayer", label: "Prayer", hint: "Intercession, prayer rooms, and care moments", route: "/faithhub/provider/prayer-requests" },
  { key: "teaching", label: "Teaching", hint: "Bible teaching, series episodes, and doctrine", route: "/faithhub/provider/teachings-dashboard" },
  { key: "youth", label: "Youth", hint: "Youth-focused worship and discipleship streams", route: "/faithhub/provider/live-schedule" },
  { key: "events", label: "Events", hint: "Conferences, outreach, and special gatherings", route: "/faithhub/provider/events-manager" },
  { key: "testimonies", label: "Testimonies", hint: "Faith stories and transformed-life moments", route: "/faithhub/provider/testimonies" },
];

const trendingStreams = [
  { id: "trend-1", title: "Friday Night Worship Experience", provider: "Riverlight Worship Collective", viewers: "24.8K watching", route: "/faithhub/provider/live-dashboard" },
  { id: "trend-2", title: "Global Prayer Revival Room", provider: "Hope City Prayer Network", viewers: "18.1K watching", route: "/faithhub/provider/prayer-requests" },
  { id: "trend-3", title: "Faith & Work Live Teaching", provider: "Restoration House Global", viewers: "13.4K watching", route: "/faithhub/provider/teachings-dashboard" },
];

const featuredProviders = [
  { id: "fp-1", name: "Restoration House Global", specialty: "Worship + family discipleship", badge: "Featured Provider", route: "/faithhub/provider/profile-settings" },
  { id: "fp-2", name: "Riverlight Worship Collective", specialty: "Live worship and creative arts", badge: "Top Streaming Ministry", route: "/faithhub/provider/profile-settings" },
  { id: "fp-3", name: "Hope City Prayer Network", specialty: "Prayer response and care follow-up", badge: "Trusted Prayer Network", route: "/faithhub/provider/profile-settings" },
];

const streamRecommendations = [
  { id: "rec-1", title: "Continue: Morning Prayer Journey", reason: "Because you engaged with prayer streams this week", route: "/faithhub/provider/devotionals" },
  { id: "rec-2", title: "Watch Next: Sunday Encounter Replay", reason: "Trending in your worship and teaching circles", route: "/faithhub/provider/replays-and-clips" },
  { id: "rec-3", title: "Suggested: Youth Worship Night", reason: "High response among your followed communities", route: "/faithhub/provider/live-schedule" },
];

const ENGAGEMENT_STATE_KEY = "faithhub.home.engagement.v1";

type HomeEngagementState = {
  followedProviderIds: string[];
  streamReactionCounts: Record<string, number>;
  streamInteractionCounts: Record<string, number>;
  streamRaisedHands: Record<string, number>;
  streamPrayerRequestCounts: Record<string, number>;
  streamLiveComments: Record<string, string[]>;
  unreadNotifications: number;
};

const defaultEngagementState: HomeEngagementState = {
  followedProviderIds: [],
  streamReactionCounts: {},
  streamInteractionCounts: {},
  streamRaisedHands: {},
  streamPrayerRequestCounts: {},
  streamLiveComments: {},
  unreadNotifications: 4,
};

const liveFallbackImages = [
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1464375117522-1311dd7d0b44?auto=format&fit=crop&w=1400&q=80",
] as const;

function metricSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function deriveLiveMetrics(session: LiveFlowRecord) {
  const seed = metricSeed(`${session.id}|${session.title}|${session.startISO}`);
  const viewers = 500 + (seed % 24000);
  const reactions = Math.max(120, Math.floor(viewers * (0.18 + ((seed % 17) / 100))));
  const prayerResponses = Math.max(32, Math.floor(reactions * (0.14 + ((seed % 11) / 100))));
  return { viewers, reactions, prayerResponses };
}

function mapSessionToPreview(session: LiveFlowRecord, index: number) {
  const { viewers, reactions, prayerResponses } = deriveLiveMetrics(session);
  return {
    id: session.id,
    title: session.title || "Live Worship Session",
    campus: session.campus || "Online Campus",
    viewers,
    reactions,
    prayerResponses,
    image: liveFallbackImages[index % liveFallbackImages.length],
  };
}

const featureCards = [
  {
    icon: Radio,
    title: "Livestreaming Control",
    body: "Run services, worship nights, and prayer broadcasts with polished live production, moderation, and post-live continuity.",
  },
  {
    icon: MessageSquareHeart,
    title: "Prayer Rooms & Care",
    body: "Collect prayer requests, route pastoral care, and sustain prayer follow-up with high-trust, community-first workflows.",
  },
  {
    icon: Sparkles,
    title: "Worship & Replay Experience",
    body: "Carry worship moments beyond the livestream through replays, clips, reflections, and devotion-ready content journeys.",
  },
  {
    icon: Users,
    title: "Community Formation",
    body: "Grow meaningful digital fellowship through groups, testimonies, events, and communication journeys that keep people connected.",
  },
];

const journeyCards = [
  {
    title: "For worship ministries",
    points: [
      "Livestream services and worship gatherings",
      "Publish worship moments and replay highlights",
      "Guide members into prayer and next steps",
    ],
  },
  {
    title: "For prayer networks",
    points: [
      "Host prayer chains and regional prayer rooms",
      "Route prayer needs to trusted care teams",
      "Track follow-through without losing warmth",
    ],
  },
  {
    title: "For digital faith communities",
    points: [
      "Create consistent live-and-replay rhythms",
      "Build belonging through groups and testimonies",
      "Activate outreach, events, and support journeys",
    ],
  },
];

const experiencePillars = [
  {
    eyebrow: "Live Participation",
    title: "Move viewers into real-time worship engagement",
    body: "Turn passive viewing into active participation through chat, prayer prompts, response moments, and guided next steps during and after livestreams.",
  },
  {
    eyebrow: "Pastoral Care",
    title: "Prayer and care flows built for trust",
    body: "Support moderation, privacy-aware prayer journeys, and safe communication so spiritual care remains credible, timely, and human.",
  },
  {
    eyebrow: "Community Formation",
    title: "Designed for belonging beyond Sunday",
    body: "From groups and testimonies to events and follow-up journeys, FaithHub helps people stay connected between services and keep growing together.",
  },
];

const PROFILE_PREFS_KEY = "faithhub.provider.profile.prefs.v1";

type ProviderProfileCard = {
  id: string;
  ministry: string;
  region: string;
  introVideoLabel: string;
  schedule: string;
  specialties: string[];
  badges: string[];
  brandAccent: string;
};

type StoredProviderProfilePrefs = {
  displayName?: string;
  title?: string;
  bio?: string;
  language?: string;
  timezone?: string;
};

const providerProfiles: ProviderProfileCard[] = [
  {
    id: "profile-1",
    ministry: "Restoration House Global",
    region: "Kampala | Nairobi | Online",
    introVideoLabel: "Welcome from Lead Pastor",
    schedule: "Sun 9:00 AM + Wed 7:30 PM",
    specialties: ["Prayer & Intercession", "Family Discipleship", "Youth Worship"],
    badges: ["Verified Ministry", "Child-safe Streams", "Trusted Giving"],
    brandAccent: "from-emerald-400/25 to-sky-400/25",
  },
  {
    id: "profile-2",
    ministry: "Riverlight Worship Collective",
    region: "Lagos | London | Online",
    introVideoLabel: "Worship Vision Reel",
    schedule: "Fri 8:00 PM + Sun 10:30 AM",
    specialties: ["Live Worship Nights", "Creative Arts", "Global Prayer Rooms"],
    badges: ["Verified Worship Team", "Moderated Community", "Replay Certified"],
    brandAccent: "from-fuchsia-400/25 to-indigo-400/25",
  },
  {
    id: "profile-3",
    ministry: "Hope City Prayer Network",
    region: "Johannesburg | Cape Town | Online",
    introVideoLabel: "Prayer Network Intro",
    schedule: "Daily 6:00 AM + 9:00 PM",
    specialties: ["24/7 Prayer Chains", "Counseling Triage", "Care Follow-up"],
    badges: ["Verified Prayer Network", "Pastoral Care Team", "Response SLA Active"],
    brandAccent: "from-amber-400/25 to-orange-400/25",
  },
];

function readStoredProviderProfilePrefs(): StoredProviderProfilePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProviderProfilePrefs;
  } catch {
    return null;
  }
}

function buildProfileCardsFromStorage(): ProviderProfileCard[] {
  const workspace = getStoredWorkspace();
  const prefs = readStoredProviderProfilePrefs();
  const hasWorkspace = Boolean(workspace?.brand?.trim() || workspace?.campus?.trim());
  const hasPrefs = Boolean(prefs?.displayName?.trim() || prefs?.title?.trim() || prefs?.bio?.trim());
  if (!hasWorkspace && !hasPrefs) return providerProfiles;

  const ministry = workspace?.brand?.trim() || "FaithHub Ministry";
  const campus = workspace?.campus?.trim() || "Online Campus";
  const title = prefs?.title?.trim();
  const hostName = prefs?.displayName?.trim() || "Provider Host";
  const language = prefs?.language?.trim() || "English";
  const timezone = prefs?.timezone?.trim() || "Africa/Kampala";
  const bio = prefs?.bio?.trim();

  const baseProfile: ProviderProfileCard = {
    id: "profile-real",
    ministry,
    region: `${campus} • Online`,
    introVideoLabel: title ? `${title} Intro` : `Welcome from ${hostName}`,
    schedule: `Weekly • ${timezone}`,
    specialties: [
      "Livestream Worship",
      "Prayer & Care",
      language === "English" ? "Teaching & Discipleship" : `${language} Ministry`,
    ],
    badges: ["Verified Ministry", "Provider Profile Active", "Community-ready"],
    brandAccent: "from-[var(--fh-brand)]/30 to-[var(--fh-accent)]/28",
  };

  if (bio) {
    baseProfile.specialties = [baseProfile.specialties[0], baseProfile.specialties[1], bio.slice(0, 44)];
  }

  return [baseProfile, ...providerProfiles.slice(0, 2)];
}

const communityProof = [
  {
    quote:
      "Our livestream worship attendance grew, but the biggest win was prayer follow-up. People felt seen within hours, not days.",
    name: "Pastor Miriam K.",
    role: "Lead Pastor, New Dawn Worship Centre",
  },
  {
    quote:
      "FaithHub helped our team connect worship, prayer requests, and small-group care into one weekly flow that actually sticks.",
    name: "Joel T.",
    role: "Worship Director, Riverlight Fellowship",
  },
  {
    quote:
      "We moved from scattered tools to one trusted rhythm: live service, replay devotion, prayer response, and group follow-up.",
    name: "Grace A.",
    role: "Community Lead, Hope Online Church",
  },
];

const communityHubCards = [
  {
    key: "prayer-wall",
    title: "Prayer Wall",
    body: "Receive prayer requests in one trusted lane, assign follow-up owners, and keep care response fast and pastoral.",
    route: "/faithhub/provider/prayer-requests",
    icon: HeartHandshake,
    stat: "320K+ monthly prayer interactions",
  },
  {
    key: "testimonies",
    title: "Testimonies",
    body: "Collect life-change stories, run approval checks, and publish safe testimonies that strengthen faith.",
    route: "/faithhub/provider/testimonies",
    icon: Sparkles,
    stat: "Moderated story pipeline",
  },
  {
    key: "groups",
    title: "Groups",
    body: "Build belonging through discipleship circles, prayer groups, and shared community rhythms.",
    route: "/faithhub/provider/community-groups",
    icon: Users,
    stat: "Cross-campus engagement",
  },
  {
    key: "devotionals",
    title: "Devotionals",
    body: "Launch daily and weekly devotional journeys that bridge livestream worship, prayer, and follow-up.",
    route: "/faithhub/provider/devotionals",
    icon: BookOpen,
    stat: "Daily journey cadence",
  },
];

const footerCols = [
  {
    title: "Ecosystem",
    links: ["Live Sessions", "Prayer Flows", "Worship Replays", "Events", "Beacon", "Community"],
  },
  {
    title: "For providers",
    links: ["FaithHub Provider onboarding", "FaithHub Provider Dashboard", "Audience tools", "Books & resources", "Merchandise", "Wallet & payouts"],
  },
  {
    title: "Explore",
    links: ["Faith communities", "Series & replays", "Prayer", "Testimonies", "Devotionals", "Noticeboard"],
  },
  {
    title: "Company",
    links: ["About FaithHub", "Get started", "Book a demo", "Support", "Privacy", "Terms"],
  },
];

function InstagramBrandIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YoutubeBrandIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 12c0 2.8-.3 4.5-.7 5.4a2.9 2.9 0 0 1-1.7 1.7c-.9.4-2.6.7-6.6.7s-5.7-.3-6.6-.7a2.9 2.9 0 0 1-1.7-1.7C3.3 16.5 3 14.8 3 12s.3-4.5.7-5.4a2.9 2.9 0 0 1 1.7-1.7c.9-.4 2.6-.7 6.6-.7s5.7.3 6.6.7a2.9 2.9 0 0 1 1.7 1.7c.4.9.7 2.6.7 5.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10 8.6 16 12l-6 3.4V8.6Z" fill="currentColor" />
    </svg>
  );
}

function FacebookBrandIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.3 20v-6.2h2.1l.4-2.5h-2.5V9.8c0-.8.3-1.3 1.4-1.3H16V6.2c-.2 0-.9-.1-1.8-.1-1.9 0-3.2 1.1-3.2 3.4v1.8H9v2.5h2v6.2h2.3Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SocialIconButton({ href = "#", label, children }: { href?: string; label: string; children: React.ReactNode }) {
  return (
    <a
      aria-label={label}
      title={label}
      className="ds-icon h-11 w-11 rounded-2xl transition hover:-translate-y-0.5"
      href={href}
    >
      <span className="text-slate-700">{children}</span>
    </a>
  );
}

function Chip({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "orange" | "neutral" }) {
  const styles =
    tone === "green"
      ? "bg-[var(--fh-brand)]/10 text-[var(--fh-brand)] border-[var(--fh-brand)]/20"
      : tone === "orange"
        ? "bg-[var(--fh-accent)]/10 text-[var(--fh-accent)] border-[var(--fh-accent)]/20"
        : "bg-white/80 text-slate-600 border-slate-200";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${styles}`}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-black uppercase tracking-[0.24em] text-[var(--fh-brand)]">{eyebrow}</div>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-600">{body}</p>
    </div>
  );
}

export default function FaithHubHomeLandingPageV3Fixed() {
  const navigate = useNavigate();
  const trackedScrollMilestones = React.useRef<Set<number>>(new Set());
  const [liveState, setLiveState] = React.useState(() => localLiveSessionsApi.getState());
  const [profileCards, setProfileCards] = React.useState<ProviderProfileCard[]>(() => buildProfileCardsFromStorage());
  const [engagementState, setEngagementState] = React.useState<HomeEngagementState>(defaultEngagementState);
  const [liveCommentDrafts, setLiveCommentDrafts] = React.useState<Record<string, string>>({});

  const trackHomeEvent = React.useCallback((eventName: string, payload?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("fh:analytics", {
        detail: {
          feature: "homepage_hero",
          event: eventName,
          timestamp: new Date().toISOString(),
          ...payload,
        },
      }),
    );
  }, []);

  React.useEffect(() => {
    trackHomeEvent("hero_view");
  }, [trackHomeEvent]);

  React.useEffect(() => {
    const unsubscribe = localLiveSessionsApi.subscribe(() => {
      setLiveState(localLiveSessionsApi.getState());
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const syncProfiles = () => {
      setProfileCards(buildProfileCardsFromStorage());
    };
    window.addEventListener("storage", syncProfiles);
    return () => window.removeEventListener("storage", syncProfiles);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(ENGAGEMENT_STATE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<HomeEngagementState>;
      setEngagementState((prev) => ({
        ...prev,
        ...parsed,
        followedProviderIds: Array.isArray(parsed.followedProviderIds) ? parsed.followedProviderIds : prev.followedProviderIds,
        streamReactionCounts: parsed.streamReactionCounts && typeof parsed.streamReactionCounts === "object" ? parsed.streamReactionCounts : prev.streamReactionCounts,
        streamInteractionCounts: parsed.streamInteractionCounts && typeof parsed.streamInteractionCounts === "object" ? parsed.streamInteractionCounts : prev.streamInteractionCounts,
        streamRaisedHands: parsed.streamRaisedHands && typeof parsed.streamRaisedHands === "object" ? parsed.streamRaisedHands : prev.streamRaisedHands,
        streamPrayerRequestCounts: parsed.streamPrayerRequestCounts && typeof parsed.streamPrayerRequestCounts === "object" ? parsed.streamPrayerRequestCounts : prev.streamPrayerRequestCounts,
        streamLiveComments: parsed.streamLiveComments && typeof parsed.streamLiveComments === "object" ? parsed.streamLiveComments : prev.streamLiveComments,
      }));
    } catch {
      // no-op
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ENGAGEMENT_STATE_KEY, JSON.stringify(engagementState));
  }, [engagementState]);

  const liveNowStreams = React.useMemo(() => {
    const now = Date.now();
    const liveSessions = liveState.sessions
      .filter((session) => {
        const start = Date.parse(session.startISO);
        const end = Date.parse(session.endISO);
        if (Number.isNaN(start) || Number.isNaN(end)) return false;
        return now >= start && now <= end;
      })
      .slice(0, 3)
      .map(mapSessionToPreview);

    return liveSessions.length > 0 ? liveSessions : defaultLiveNowStreams;
  }, [liveState.sessions]);

  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.round((window.scrollY / total) * 100);
      [25, 50, 75].forEach((milestone) => {
        if (pct >= milestone && !trackedScrollMilestones.current.has(milestone)) {
          trackedScrollMilestones.current.add(milestone);
          trackHomeEvent("scroll_depth", { milestone });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [trackHomeEvent]);

  const navigateProvider = (path: string) => {
    const token = getStoredToken();
    const isOnboardingRoute = path.startsWith("/faithhub/provider/onboarding");
    if (token || isOnboardingRoute) {
      navigate(path);
      return;
    }
    navigate("/faithhub/provider", { state: { from: path } });
  };

  const footerRouteMap: Record<string, string> = {
    "Live Sessions": "/faithhub/provider/live-dashboard",
    Teachings: "/faithhub/provider/teachings-dashboard",
    Giving: "/faithhub/provider/donations-and-funds",
    Events: "/faithhub/provider/events-manager",
    Beacon: "/faithhub/provider/beacon-dashboard",
    Community: "/faithhub/provider/community-groups",
    "FaithHub Provider onboarding": "/faithhub/provider/onboarding",
    "FaithHub Provider Dashboard": "/faithhub/provider/dashboard",
    "Audience tools": "/faithhub/provider/audience-notifications",
    "Books & resources": "/faithhub/provider/books-manager",
    Merchandise: "/faithhub/provider/merchandise-manager",
    "Wallet & payouts": "/faithhub/provider/wallet-payouts",
    "Faith communities": "/faithhub/provider/community-groups",
    "Series & replays": "/faithhub/provider/replays-and-clips",
    Prayer: "/faithhub/provider/prayer-requests",
    Testimonies: "/faithhub/provider/testimonies",
    Devotionals: "/faithhub/provider/devotionals",
    Crowdfunding: "/faithhub/provider/charity-crowdfunding-workbench",
    Noticeboard: "/faithhub/provider/noticeboard",
    "About FaithHub": "/faithhub/home",
    "Get started": "/faithhub/provider/onboarding",
    "Book a demo": "/faithhub/provider/dashboard",
    Support: "/faithhub/home#footer",
    Privacy: "/faithhub/provider/workspace-settings",
    Terms: "/faithhub/provider/workspace-settings",
  };

  const navigateFooterLink = (label: string) => {
    const target = footerRouteMap[label] ?? "/faithhub/provider/dashboard";
    if (target.startsWith("/faithhub/provider")) {
      navigateProvider(target);
      return;
    }
    navigate(target);
  };

  const toggleProviderFollow = (providerId: string) => {
    setEngagementState((prev) => {
      const isFollowed = prev.followedProviderIds.includes(providerId);
      const followedProviderIds = isFollowed
        ? prev.followedProviderIds.filter((id) => id !== providerId)
        : [...prev.followedProviderIds, providerId];
      return { ...prev, followedProviderIds };
    });
    trackHomeEvent("provider_follow_toggle", { providerId });
  };

  const reactToStream = (streamId: string) => {
    setEngagementState((prev) => ({
      ...prev,
      streamReactionCounts: {
        ...prev.streamReactionCounts,
        [streamId]: (prev.streamReactionCounts[streamId] ?? 0) + 1,
      },
    }));
    trackHomeEvent("stream_reaction", { streamId });
  };

  const interactWithStream = (streamId: string) => {
    setEngagementState((prev) => ({
      ...prev,
      streamInteractionCounts: {
        ...prev.streamInteractionCounts,
        [streamId]: (prev.streamInteractionCounts[streamId] ?? 0) + 1,
      },
    }));
    trackHomeEvent("stream_interaction", { streamId });
  };

  const markNotificationsRead = () => {
    setEngagementState((prev) => ({ ...prev, unreadNotifications: 0 }));
    trackHomeEvent("notifications_mark_read");
  };

  const raiseHandForPrayer = (streamId: string) => {
    setEngagementState((prev) => ({
      ...prev,
      streamRaisedHands: {
        ...prev.streamRaisedHands,
        [streamId]: (prev.streamRaisedHands[streamId] ?? 0) + 1,
      },
    }));
    trackHomeEvent("raise_hand_for_prayer", { streamId });
  };

  const sendPrayerRequest = (streamId: string) => {
    setEngagementState((prev) => ({
      ...prev,
      streamPrayerRequestCounts: {
        ...prev.streamPrayerRequestCounts,
        [streamId]: (prev.streamPrayerRequestCounts[streamId] ?? 0) + 1,
      },
    }));
    trackHomeEvent("stream_prayer_request", { streamId });
  };

  const submitLiveComment = (streamId: string) => {
    const comment = (liveCommentDrafts[streamId] ?? "").trim();
    if (!comment) return;
    setEngagementState((prev) => ({
      ...prev,
      streamLiveComments: {
        ...prev.streamLiveComments,
        [streamId]: [...(prev.streamLiveComments[streamId] ?? []), comment].slice(-5),
      },
      streamInteractionCounts: {
        ...prev.streamInteractionCounts,
        [streamId]: (prev.streamInteractionCounts[streamId] ?? 0) + 1,
      },
    }));
    setLiveCommentDrafts((prev) => ({ ...prev, [streamId]: "" }));
    trackHomeEvent("stream_live_comment", { streamId });
  };

  return (
    <div className="fh-brand-shell min-h-screen overflow-hidden bg-[var(--fh-ev-light-grey)] text-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,205,140,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(247,127,0,0.16),transparent_26%),linear-gradient(to_bottom,#ffffff,rgba(242,242,242,0.9))]" />
        <div className="absolute -top-10 left-[-8rem] h-80 w-80 rounded-full bg-[var(--fh-brand)]/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-[var(--fh-accent)]/20 blur-3xl" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <BrandLogo variant="symbol" alt="FaithHub icon" className="h-12 w-12 rounded-2xl" />
            <div>
              <div className="text-lg font-black tracking-tight">{brandMessaging.productName}</div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">{brandMessaging.poweredBy}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 lg:flex">
            <a href="#features" className="transition hover:text-[var(--fh-brand)]">Features</a>
            <a href="#who" className="transition hover:text-[var(--fh-brand)]">Communities</a>
            <a href="#experience" className="transition hover:text-[var(--fh-brand)]">Worship Flow</a>
            <a href="#footer" className="transition hover:text-[var(--fh-brand)]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeModeToggle />
            <CtaButton
              variant="outline"
              className="hidden rounded-2xl text-sm font-black lg:inline-flex"
              onClick={() => {
                trackHomeEvent("header_cta_click", { cta: "sign_in" });
                navigate("/faithhub/provider");
              }}
            >
              Sign in
            </CtaButton>
            <CtaButton
              variant="primary"
              className="rounded-2xl px-5 py-3 text-sm font-black"
              onClick={() => {
                trackHomeEvent("header_cta_click", { cta: "join_faithhub" });
                navigateProvider("/faithhub/provider/onboarding");
              }}
            >
              Join FaithHub
            </CtaButton>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-10">
          <motion.div {...fadeUp} className="fh-brand-hero fh-animate-fade-up max-w-3xl p-6 sm:p-8">
            <Chip>{brandMessaging.heroLabel}</Chip>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {brandMessaging.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {brandMessaging.heroBody}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButton
                variant="primary"
                className="rounded-2xl px-6 py-4 text-base font-black"
                onClick={() => {
                  trackHomeEvent("hero_cta_click", { cta: "start_with_faithhub", placement: "hero_primary" });
                  navigateProvider("/faithhub/provider/onboarding");
                }}
              >
                Start provider onboarding
                <ArrowRight className="h-5 w-5" />
              </CtaButton>
              <CtaButton
                variant="secondary"
                className="rounded-2xl border-[var(--fh-accent)]/35 px-6 py-4 text-base font-black text-[var(--fh-accent)]"
                onClick={() => {
                  trackHomeEvent("hero_cta_click", { cta: "open_prayer_flow", placement: "hero_secondary" });
                  navigateProvider("/faithhub/provider/prayer-requests");
                }}
              >
                <MessageSquareHeart className="h-5 w-5" />
                Open provider prayer flow
              </CtaButton>
              <CtaButton
                variant="outline"
                className="rounded-2xl px-6 py-4 text-base font-black"
                onClick={() => {
                  trackHomeEvent("hero_cta_click", { cta: "watch_experience", placement: "hero_secondary" });
                  navigateProvider("/faithhub/provider/live-dashboard");
                }}
              >
                <Play className="h-5 w-5" />
                Watch live flow
              </CtaButton>
            </div>

            <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3 py-2">1. Set up ministry profile</div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3 py-2">2. Launch first live moment</div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-3 py-2">3. Route prayer follow-up</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Chip tone="green"><ShieldCheck className="h-3.5 w-3.5" /> High-trust platform</Chip>
              <Chip tone="orange"><Languages className="h-3.5 w-3.5" /> Multilingual by design</Chip>
              <Chip tone="neutral"><Globe className="h-3.5 w-3.5" /> Built for global reach</Chip>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -4 }}
                  className="fh-brand-panel rounded-[1.75rem] p-5"
                >
                  <div className="text-3xl font-black text-slate-950">{item.value}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-500">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute left-4 top-6 hidden h-24 w-24 rounded-[2rem] bg-[var(--fh-brand)]/15 blur-2xl lg:block" />
            <div className="absolute bottom-10 right-2 hidden h-28 w-28 rounded-[2rem] bg-[var(--fh-accent)]/15 blur-2xl lg:block" />

            <div className="fh-brand-panel fh-shimmer-surface relative rounded-[2.2rem] p-4 lg:p-5">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-950 shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
                      alt="Faith community gathering"
                      className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Chip tone="green"><span className="h-2.5 w-2.5 rounded-full bg-[var(--fh-brand)] motion-safe:animate-pulse" /> Live now</Chip>
                      <Chip tone="orange"><BellRing className="h-3.5 w-3.5" /> 18.4K in worship</Chip>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--fh-brand)]">Featured experience</div>
                        <div className="mt-2 max-w-xl text-2xl font-black text-white sm:text-3xl">Sunday Worship Live, Prayer Rooms, and Community Care</div>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">
                          Beautiful livestreaming with chat, follow-up, translation, giving prompts, replay packaging, and premium engagement journeys.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
                        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">Live outcomes</div>
                        <div className="mt-2 space-y-2 text-sm font-semibold">
                          <div className="flex items-center justify-between gap-6"><span>Watch starts</span><span>24.1K</span></div>
                          <div className="flex items-center justify-between gap-6"><span>Giving activity</span><span>$18.7K</span></div>
                          <div className="flex items-center justify-between gap-6"><span>Replay queued</span><span>Yes</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Livestream Momentum</div>
                        <div className="mt-2 text-xl font-black">Real-time worship reach</div>
                      </div>
                      <div className="rounded-2xl bg-[var(--fh-accent)]/10 px-3 py-2 text-sm font-black text-[var(--fh-accent)]">Active</div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[76%] rounded-full bg-[var(--fh-accent)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-500">
                      <span>Livestream momentum</span>
                      <span>76%</span>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Prayer & community</div>
                    <div className="mt-2 text-xl font-black">Trust-rich care journeys</div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Raised</div>
                        <div className="mt-2 text-2xl font-black">$124K</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Supporters</div>
                        <div className="mt-2 text-2xl font-black">3,912</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <motion.div {...fadeUp} className="fh-brand-panel grid gap-4 rounded-[2rem] p-5 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Radio className="h-5 w-5 text-[var(--fh-brand)]" />
            <div>
              <div className="text-sm font-black">Live broadcasts</div>
              <div className="text-xs text-slate-500">Worship, teaching, prayer, community</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Users className="h-5 w-5 text-[var(--fh-brand)]" />
            <div>
              <div className="text-sm font-black">Community journeys</div>
              <div className="text-xs text-slate-500">Prayer, groups, testimonies, counseling</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <CalendarDays className="h-5 w-5 text-[var(--fh-brand)]" />
            <div>
              <div className="text-sm font-black">Events & notices</div>
              <div className="text-xs text-slate-500">Services, conferences, retreats, outreach</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <HeartHandshake className="h-5 w-5 text-[var(--fh-brand)]" />
            <div>
              <div className="text-sm font-black">Giving with trust</div>
              <div className="text-xs text-slate-500">Funds, campaigns, charity crowdfunding</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="Core Experiences"
          title="Purpose-built flows for livestream, prayer, worship, and community."
          body={brandMessaging.platformSectionBody}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -6 }}
                className="group rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition group-hover:bg-[var(--fh-brand)]">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-5 text-xl font-black tracking-tight">{feature.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.body}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--fh-brand)]">
                  Explore
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="who" className="bg-white/70 py-16 backdrop-blur lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
            <SectionHeading
              eyebrow="Who It Serves"
              title="Made for worship leaders, prayer teams, and community builders."
              body={brandMessaging.audienceSectionBody}
            />

            <div className="grid gap-5 md:grid-cols-3">
              {journeyCards.map((journey) => (
                <motion.div key={journey.title} {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-xl font-black tracking-tight">{journey.title}</div>
                  <div className="mt-5 space-y-3">
                    {journey.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                        <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--fh-brand)]" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="grid gap-5">
            {experiencePillars.map((pillar) => (
              <motion.div key={pillar.title} {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[var(--fh-accent)]">{pillar.eyebrow}</div>
                <div className="mt-3 text-2xl font-black tracking-tight">{pillar.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute inset-x-12 top-8 h-20 rounded-full bg-[var(--fh-brand)]/15 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-24 w-24 rounded-full bg-[var(--fh-accent)]/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.3rem] border border-white/70 bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
              <div className="grid gap-0 md:grid-cols-[0.62fr_0.38fr]">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                  <img
                    src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80"
                    alt="Faith community in a service"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60">Experience layer</div>
                    <div className="mt-2 text-xl font-black">Live, replay, events, giving, books, resources, community</div>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-4 border-l border-white/10 bg-slate-950/90 p-5 text-white backdrop-blur">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--fh-brand)]">What people can do</div>
                    <div className="mt-4 space-y-3 text-sm text-white/80">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Join livestream worship and prayer in real time</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Continue with replays, devotionals, and teaching clips</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Share prayer requests and receive trusted follow-up</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Belong through groups, testimonies, and community care</div>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--fh-brand)] p-5 text-white shadow-[0_16px_35px_rgba(3,205,140,0.28)]">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Why it persuades</div>
                    <div className="mt-2 text-2xl font-black">Because every faith action feels immediate, pastoral, trustworthy, and connected.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-6 lg:px-10">
        <motion.div {...fadeUp} className="grid gap-5 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_1fr_1fr]">
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--fh-brand)]/10 p-3 text-[var(--fh-brand)]"><Building2 className="h-5 w-5" /></div>
              <div className="text-xl font-black">FaithHub-ready Provider</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">World-class provider tools for onboarding, live production, teaching creation, events, giving, promotions, resources, books, merchandise, and governance.</p>
          </div>
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--fh-brand)]/10 p-3 text-[var(--fh-brand)]"><MessageSquareHeart className="h-5 w-5" /></div>
              <div className="text-xl font-black">Community-first</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">Prayer requests, journals, testimonies, counseling, projects, forums, groups, and notices bring human warmth into the platform rather than making it feel like a cold tool.</p>
          </div>
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--fh-brand)]/10 p-3 text-[var(--fh-brand)]"><ShieldCheck className="h-5 w-5" /></div>
              <div className="text-xl font-black">High trust by design</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">FaithHub is designed for quality moderation, provider workflow controls, approvals, audit visibility, and thoughtful experiences across sensitive faith and community contexts.</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <SectionHeading
          eyebrow="Live Streaming Experience"
          title="Live now, with real-time community response."
          body="See active streams, viewer momentum, and live reactions while your team routes prayer responses and keeps worship engagement high."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {liveNowStreams.map((stream) => (
            <motion.div
              key={stream.id}
              {...fadeUp}
              className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={stream.image} alt={stream.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                  <span className="h-2 w-2 motion-safe:animate-pulse rounded-full bg-emerald-300" />
                  Live now
                </div>
                <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-slate-800">
                  <Eye className="h-3.5 w-3.5" />
                  {stream.viewers.toLocaleString()}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">{stream.campus}</div>
                  <div className="mt-1 text-lg font-black text-white">{stream.title}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Reactions</div>
                    <div className="mt-1 flex items-center gap-1.5 text-base font-black text-slate-900">
                      <Heart className="h-4 w-4 text-rose-500" />
                      {stream.reactions.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Prayer Responses</div>
                    <div className="mt-1 flex items-center gap-1.5 text-base font-black text-slate-900">
                      <MessageCircle className="h-4 w-4 text-[var(--fh-accent)]" />
                      {stream.prayerResponses.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-label={`Raise hand for prayer in ${stream.title}`}
                    className="ds-btn ds-btn--outline rounded-xl px-3 py-2 text-xs font-bold"
                    onClick={() => raiseHandForPrayer(stream.id)}
                  >
                    Raise hand | {(engagementState.streamRaisedHands[stream.id] ?? 0).toLocaleString()}
                  </button>
                  <button
                    type="button"
                    aria-label={`Send prayer request in ${stream.title}`}
                    className="ds-btn ds-btn--secondary rounded-xl px-3 py-2 text-xs font-bold"
                    onClick={() => sendPrayerRequest(stream.id)}
                  >
                    Prayer request | {(engagementState.streamPrayerRequestCounts[stream.id] ?? 0).toLocaleString()}
                  </button>
                </div>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500" htmlFor={`live-comment-${stream.id}`}>
                    Live comments
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id={`live-comment-${stream.id}`}
                      aria-label={`Add live comment for ${stream.title}`}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-[var(--fh-brand)]"
                      placeholder="Share encouragement..."
                      value={liveCommentDrafts[stream.id] ?? ""}
                      onChange={(event) =>
                        setLiveCommentDrafts((prev) => ({ ...prev, [stream.id]: event.target.value }))
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Send live comment for ${stream.title}`}
                      className="ds-btn ds-btn--primary rounded-xl px-3 py-2 text-xs font-bold text-white"
                      onClick={() => submitLiveComment(stream.id)}
                    >
                      Send
                    </button>
                  </div>
                  {(engagementState.streamLiveComments[stream.id] ?? []).length > 0 ? (
                    <div className="mt-2 text-xs text-slate-700">
                      Latest: {(engagementState.streamLiveComments[stream.id] ?? [])[((engagementState.streamLiveComments[stream.id] ?? []).length - 1)]}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                  onClick={() => navigateProvider("/faithhub/provider/live-dashboard")}
                >
                  <Play className="h-4 w-4" />
                  Open stream preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <SectionHeading
          eyebrow="Stream Discovery"
          title="Find the right streams faster with curated discovery."
          body="Browse by category, follow trending moments, discover featured providers, and pick up recommendations tailored to community engagement."
        />

        <motion.div {...fadeUp} className="fh-uplift-surface mt-8 rounded-[1.8rem] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Notifications</div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {engagementState.unreadNotifications > 0
                  ? `${engagementState.unreadNotifications} unread engagement alerts`
                  : "All caught up"}
              </div>
            </div>
            <button
              type="button"
              aria-label="Mark all notifications as read"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition hover:bg-white"
              onClick={markNotificationsRead}
            >
              <BellRing className="h-4 w-4" />
              Mark all read
            </button>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <motion.div {...fadeUp} className="fh-uplift-surface rounded-[1.8rem] p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Categories</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {streamDiscoveryCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:bg-white"
                  onClick={() => navigateProvider(category.route)}
                >
                  <div className="text-sm font-black text-slate-900">{category.label}</div>
                  <div className="mt-1 text-xs text-slate-600">{category.hint}</div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="fh-uplift-surface rounded-[1.8rem] p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Trending Streams</div>
            <div className="mt-4 space-y-3">
              {trendingStreams.map((stream) => (
                <div key={stream.id} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => navigateProvider(stream.route)}
                  >
                    <div className="text-sm font-black text-slate-900">{stream.title}</div>
                    <div className="mt-1 text-xs text-slate-600">{stream.provider}</div>
                    <div className="mt-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fh-accent)]">{stream.viewers}</div>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      aria-label={`React to ${stream.title}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      onClick={() => reactToStream(stream.id)}
                    >
                      React | {(engagementState.streamReactionCounts[stream.id] ?? 0).toLocaleString()}
                    </button>
                    <button
                      type="button"
                      aria-label={`Interact with ${stream.title}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      onClick={() => interactWithStream(stream.id)}
                    >
                      Interact | {(engagementState.streamInteractionCounts[stream.id] ?? 0).toLocaleString()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <motion.div {...fadeUp} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Featured Providers</div>
            <div className="mt-4 space-y-3">
              {featuredProviders.map((provider) => (
                <div key={provider.id} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => navigateProvider(provider.route)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-black text-slate-900">{provider.name}</div>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                        {provider.badge}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-600">{provider.specialty}</div>
                  </button>
                  <button
                    type="button"
                    aria-label={`Follow ${provider.name}`}
                    className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    onClick={() => toggleProviderFollow(provider.id)}
                  >
                    {engagementState.followedProviderIds.includes(provider.id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Recommendations For You</div>
            <div className="mt-4 space-y-3">
              {streamRecommendations.map((recommendation) => (
                <button
                  key={recommendation.id}
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-white"
                  onClick={() => navigateProvider(recommendation.route)}
                >
                  <div className="text-sm font-black text-slate-900">{recommendation.title}</div>
                  <div className="mt-1 text-xs text-slate-600">{recommendation.reason}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <SectionHeading
          eyebrow="Provider Profiles"
          title="Ministry profiles that feel trusted, branded, and alive."
          body="Each provider profile combines ministry branding, trust badges, intro video context, worship schedules, and specialties so people immediately understand who you are and how to connect."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {profileCards.map((profile) => (
            <motion.div
              key={profile.id}
              {...fadeUp}
              className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-20 bg-gradient-to-r ${profile.brandAccent}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-black tracking-tight text-slate-900">{profile.ministry}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{profile.region}</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                    <Palette className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Intro video</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Play className="h-4 w-4 text-[var(--fh-brand)]" />
                    {profile.introVideoLabel}
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Schedule</div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <CalendarDays className="h-4 w-4 text-[var(--fh-accent)]" />
                    {profile.schedule}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Specialties</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.specialties.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Badges</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.badges.map((badge) => (
                      <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                  onClick={() => navigateProvider("/faithhub/provider/profile-settings")}
                >
                  Open profile setup
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <SectionHeading
          eyebrow="Community Features"
          title="Prayer wall, testimonies, groups, and devotionals in one connected hub."
          body="Help people move from livestream moments into meaningful faith steps with connected community experiences your team can steward confidently."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {communityHubCards.map((item) => (
            <motion.div key={item.key} {...fadeUp} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-2xl bg-[var(--fh-brand)]/10 p-3 text-[var(--fh-brand)]">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                {item.stat}
              </div>
              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                onClick={() => navigateProvider(item.route)}
              >
                Open {item.title}
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <SectionHeading
          eyebrow="Community Proof"
          title="Trusted by worship teams and prayer communities."
          body="Real teams use FaithHub to move people from livestream moments into prayer, care, and belonging."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {communityProof.map((item) => (
            <motion.div key={item.name} {...fadeUp} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-7 text-slate-700">"{item.quote}"</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="text-sm font-black text-slate-900">{item.name}</div>
                <div className="text-xs font-semibold text-slate-500">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20 pt-10 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-slate-950 px-8 py-12 shadow-[0_30px_80px_rgba(15,23,42,0.16)] lg:px-12 lg:py-16">
            <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[var(--fh-brand)]/25 blur-3xl" />
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[var(--fh-accent)]/20 blur-3xl" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[var(--fh-brand)]">Ready to begin</div>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {brandMessaging.finalCtaTitle}
                </h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
                  {brandMessaging.finalCtaBody}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CtaButton
                  variant="primary"
                  className="rounded-2xl px-6 py-4 text-base font-black"
                  onClick={() => {
                    trackHomeEvent("hero_cta_click", { cta: "get_started", placement: "bottom_cta" });
                    navigateProvider("/faithhub/provider/onboarding");
                  }}
                >
                  Start provider onboarding
                </CtaButton>
                <CtaButton
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/5 px-6 py-4 text-base font-black text-white hover:bg-white/10"
                  onClick={() => {
                    trackHomeEvent("hero_cta_click", { cta: "book_demo", placement: "bottom_cta" });
                    navigateProvider("/faithhub/provider/dashboard");
                  }}
                >
                  Open provider dashboard
                </CtaButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer id="footer" className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <BrandLogo variant="symbol" alt="FaithHub icon" className="h-12 w-12 rounded-2xl" />
                <div>
                  <div className="text-lg font-black tracking-tight">{brandMessaging.productName}</div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">{brandMessaging.poweredBy}</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
                {brandMessaging.footerBody}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <SocialIconButton label="Instagram" href="https://www.instagram.com/">
                  <InstagramBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="YouTube" href="https://www.youtube.com/">
                  <YoutubeBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="Facebook" href="https://www.facebook.com/">
                  <FacebookBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="Email" href="mailto:support@faithhub.app">
                  <Mail className="h-5 w-5" />
                </SocialIconButton>
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">{col.title}</div>
                <div className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => navigateFooterLink(link)}
                      className="block text-left text-sm font-semibold text-slate-600 transition hover:text-[var(--fh-brand)]"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>&copy; 2026 FaithHub. All rights reserved.</div>
            <div className="flex flex-wrap items-center gap-5">
              <button type="button" onClick={() => navigateFooterLink("Privacy")} className="transition hover:text-[var(--fh-brand)]">Privacy</button>
              <button type="button" onClick={() => navigateFooterLink("Terms")} className="transition hover:text-[var(--fh-brand)]">Terms</button>
              <button type="button" onClick={() => navigateFooterLink("Support")} className="transition hover:text-[var(--fh-brand)]">Support</button>
              <button type="button" onClick={() => navigate("/faithhub/home#footer")} className="transition hover:text-[var(--fh-brand)]">Contact</button>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-12px_28px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
          <CtaButton
            className="flex-1 rounded-xl px-4 py-3 text-sm font-black"
            onClick={() => {
              trackHomeEvent("hero_cta_click", { cta: "mobile_get_started", placement: "sticky_mobile_bar" });
              navigateProvider("/faithhub/provider/onboarding");
            }}
          >
            Get started
          </CtaButton>
          <CtaButton
            variant="outline"
            className="flex-1 rounded-xl border-slate-300 px-4 py-3 text-sm font-black text-slate-800"
            onClick={() => {
              trackHomeEvent("hero_cta_click", { cta: "mobile_open_dashboard", placement: "sticky_mobile_bar" });
              navigateProvider("/faithhub/provider/dashboard");
            }}
          >
            Open dashboard
          </CtaButton>
        </div>
      </div>
    </div>
  );
}

function CtaButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  const variantClass =
    variant === "primary"
      ? "ds-btn--primary text-white"
      : variant === "secondary"
        ? "ds-btn--secondary"
        : "ds-btn--outline";
  return (
    <button type={type} onClick={onClick} className={`ds-btn fh-interactive ${variantClass} ${className}`.trim()}>
      {children}
    </button>
  );
}




