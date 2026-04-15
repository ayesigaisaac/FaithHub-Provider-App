import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Globe,
  HeartHandshake,
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
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme/ThemeModeToggle";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true, amount: 0.2 },
};

const stats = [
  { value: "2,400+", label: "Live communities" },
  { value: "40+", label: "Languages supported" },
  { value: "90+", label: "Nations reached" },
  { value: "120K+", label: "Moments streamed" },
];

const featureCards = [
  {
    icon: Radio,
    title: "Live Sessionz",
    body: "Host sermons, classes, worship, prayer gatherings, conferences, Q&A moments, and community broadcasts with a polished live experience.",
  },
  {
    icon: BookOpen,
    title: "Teachings & series",
    body: "Publish structured series, episodes, and standalone teachings with replays, clips, notes, resources, and elegant discovery pages.",
  },
  {
    icon: CircleDollarSign,
    title: "Giving & crowdfunds",
    body: "Run everyday giving, special campaigns, and charity crowdfunding with trust signals, updates, goals, and impact visibility.",
  },
  {
    icon: Sparkles,
    title: "Beacon promotion",
    body: "Promote live sessions, replays, events, campaigns, and announcements with premium creative, placements, and audience targeting.",
  },
];

const journeyCards = [
  {
    title: "For churches & congregations",
    points: [
      "Stream services and worship experiences",
      "Publish sermons, studies, and devotionals",
      "Coordinate giving, events, and community life",
    ],
  },
  {
    title: "For ministries & missions",
    points: [
      "Reach multilingual audiences globally",
      "Promote events, campaigns, and field updates",
      "Manage charity, outreach, and storytelling",
    ],
  },
  {
    title: "For digital faith creators",
    points: [
      "Create premium live and replay content",
      "Build audiences, resources, and subscriptions",
      "Grow responsibly with giving and merchandise",
    ],
  },
];

const experiencePillars = [
  {
    eyebrow: "Engagement",
    title: "Move visitors into participation",
    body: "Turn a landing-page visit into live attendance, replay viewing, giving, resource discovery, prayer requests, testimonies, or long-term community belonging.",
  },
  {
    eyebrow: "Trust",
    title: "Built for high-trust ministry experiences",
    body: "Support moderation, privacy-aware journeys, review management, safe communication, and polished provider presentation across every important touchpoint.",
  },
  {
    eyebrow: "Growth",
    title: "Designed for discoverability and return visits",
    body: "From Beacon promotion to replay clips and audience follow-up, FaithHub helps every important message travel further and last longer.",
  },
];

const footerCols = [
  {
    title: "Platform",
    links: ["Live Sessionz", "Teachings", "Giving", "Events", "Beacon", "Community"],
  },
  {
    title: "For providers",
    links: ["Provider onboarding", "Provider dashboard", "Audience tools", "Books & resources", "Merchandise", "Wallet & payouts"],
  },
  {
    title: "Explore",
    links: ["Faith communities", "Series & replays", "Prayer", "Testimonies", "Crowdfunding", "Noticeboard"],
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
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
      href={href}
    >
      <span className="text-slate-700">{children}</span>
    </a>
  );
}

function Chip({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "orange" | "neutral" }) {
  const styles =
    tone === "green"
      ? "bg-[#03cd8c]/10 text-[#03cd8c] border-[#03cd8c]/20"
      : tone === "orange"
        ? "bg-[#f77f00]/10 text-[#f77f00] border-[#f77f00]/20"
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
      <div className="text-xs font-black uppercase tracking-[0.24em] text-[#03cd8c]">{eyebrow}</div>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-600">{body}</p>
    </div>
  );
}

export default function FaithHubHomeLandingPageV3Fixed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f2f2f2] text-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(3,205,140,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(247,127,0,0.16),transparent_26%),linear-gradient(to_bottom,#ffffff,rgba(242,242,242,0.9))]" />
        <div className="absolute -top-10 left-[-8rem] h-80 w-80 rounded-full bg-[#03cd8c]/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-[#f77f00]/20 blur-3xl" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
              <span className="text-lg font-black">FH</span>
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">FaithHub</div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Powered by EVzone</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 lg:flex">
            <a href="#features" className="transition hover:text-[#03cd8c]">Features</a>
            <a href="#who" className="transition hover:text-[#03cd8c]">Who it serves</a>
            <a href="#experience" className="transition hover:text-[#03cd8c]">Experience</a>
            <a href="#footer" className="transition hover:text-[#03cd8c]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeModeToggle />
            <button
              className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black shadow-sm transition hover:bg-slate-50 lg:inline-flex"
              onClick={() => navigate("/faithhub/provider")}
            >
              Sign in
            </button>
            <button
              className="rounded-2xl bg-[#03cd8c] px-5 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(3,205,140,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(3,205,140,0.34)]"
              onClick={() => navigate("/faithhub/provider/onboarding")}
            >
              Join FaithHub
            </button>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-10">
          <motion.div {...fadeUp} className="max-w-3xl">
            <Chip>Global faith platform</Chip>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              A premium digital home for faith, teaching, community, and giving.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              FaithHub helps ministries, institutions, and faith creators stream live moments, publish teachings, grow communities, manage events, raise support, promote what matters, and serve people beautifully across languages, traditions, and nations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#03cd8c] px-6 py-4 text-base font-black text-white shadow-[0_16px_40px_rgba(3,205,140,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(3,205,140,0.34)]"
                onClick={() => navigate("/faithhub/provider/onboarding")}
              >
                Start with FaithHub
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-black shadow-sm transition hover:bg-slate-50">
                <Play className="h-5 w-5" />
                Watch the experience
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#03cd8c]/30 bg-white px-6 py-4 text-base font-black text-[#047857] shadow-sm transition hover:bg-emerald-50"
                onClick={() => navigate("/faithhub/provider/dashboard")}
              >
                Open Provider Dashboard
              </button>
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
                  className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <div className="text-3xl font-black text-slate-950">{item.value}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-500">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute left-4 top-6 hidden h-24 w-24 rounded-[2rem] bg-[#03cd8c]/15 blur-2xl lg:block" />
            <div className="absolute bottom-10 right-2 hidden h-28 w-28 rounded-[2rem] bg-[#f77f00]/15 blur-2xl lg:block" />

            <div className="relative rounded-[2.2rem] border border-white/70 bg-white/90 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.10)] backdrop-blur lg:p-5">
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
                      <Chip tone="green"><span className="h-2.5 w-2.5 rounded-full bg-[#03cd8c] animate-pulse" /> Live now</Chip>
                      <Chip tone="orange"><BellRing className="h-3.5 w-3.5" /> 18.4K watching</Chip>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#03cd8c]">Featured experience</div>
                        <div className="mt-2 max-w-xl text-2xl font-black text-white sm:text-3xl">Sunday Worship, Live Teaching, Prayer, and Giving</div>
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
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Beacon</div>
                        <div className="mt-2 text-xl font-black">Promotion engine built in</div>
                      </div>
                      <div className="rounded-2xl bg-[#f77f00]/10 px-3 py-2 text-sm font-black text-[#f77f00]">Active</div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[76%] rounded-full bg-[#f77f00]" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-500">
                      <span>Campaign momentum</span>
                      <span>76%</span>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Community & giving</div>
                    <div className="mt-2 text-xl font-black">Trust-rich support journeys</div>
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
        <motion.div {...fadeUp} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Radio className="h-5 w-5 text-[#03cd8c]" />
            <div>
              <div className="text-sm font-black">Live broadcasts</div>
              <div className="text-xs text-slate-500">Worship, teaching, prayer, community</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Users className="h-5 w-5 text-[#03cd8c]" />
            <div>
              <div className="text-sm font-black">Community journeys</div>
              <div className="text-xs text-slate-500">Prayer, groups, testimonies, counseling</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <CalendarDays className="h-5 w-5 text-[#03cd8c]" />
            <div>
              <div className="text-sm font-black">Events & notices</div>
              <div className="text-xs text-slate-500">Services, conferences, retreats, outreach</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <HeartHandshake className="h-5 w-5 text-[#03cd8c]" />
            <div>
              <div className="text-sm font-black">Giving with trust</div>
              <div className="text-xs text-slate-500">Funds, campaigns, charity crowdfunding</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="Everything in one place"
          title="Beautiful product experiences for every important ministry moment."
          body="FaithHub combines the warmth of community with the precision of a premium digital platform. Every surface is designed to be attractive, persuasive, and useful."
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition group-hover:bg-[#03cd8c]">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-5 text-xl font-black tracking-tight">{feature.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.body}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#03cd8c]">
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
              eyebrow="Who FaithHub serves"
              title="Made for institutions, ministries, and digital faith leaders."
              body="From local congregations to global mission movements and digital-first creators, FaithHub provides a polished foundation for connection, trust, and growth."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {journeyCards.map((journey) => (
                <motion.div key={journey.title} {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-xl font-black tracking-tight">{journey.title}</div>
                  <div className="mt-5 space-y-3">
                    {journey.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                        <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#03cd8c]" />
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
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#f77f00]">{pillar.eyebrow}</div>
                <div className="mt-3 text-2xl font-black tracking-tight">{pillar.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute inset-x-12 top-8 h-20 rounded-full bg-[#03cd8c]/15 blur-3xl" />
            <div className="absolute bottom-10 right-8 h-24 w-24 rounded-full bg-[#f77f00]/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.3rem] border border-white/70 bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
              <div className="grid gap-0 md:grid-cols-[0.62fr_0.38fr]">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                  <img
                    src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=80"
                    alt="Faith community in a service"
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
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#03cd8c]">What people can do</div>
                    <div className="mt-4 space-y-3 text-sm text-white/80">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Watch live and catch up later</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Explore teachings, books, and free resources</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Join groups, prayer, testimonies, and community conversations</div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Support causes, campaigns, and missions with confidence</div>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#03cd8c] p-5 text-white shadow-[0_16px_35px_rgba(3,205,140,0.28)]">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Why it persuades</div>
                    <div className="mt-2 text-2xl font-black">Because every action feels immediate, credible, elegant, and emotionally clear.</div>
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
              <div className="rounded-2xl bg-[#03cd8c]/10 p-3 text-[#03cd8c]"><Building2 className="h-5 w-5" /></div>
              <div className="text-xl font-black">Provider-ready</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">World-class provider tools for onboarding, live production, teaching creation, events, giving, promotions, resources, books, merchandise, and governance.</p>
          </div>
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#03cd8c]/10 p-3 text-[#03cd8c]"><MessageSquareHeart className="h-5 w-5" /></div>
              <div className="text-xl font-black">Community-first</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">Prayer requests, journals, testimonies, counseling, projects, forums, groups, and notices bring human warmth into the platform rather than making it feel like a cold tool.</p>
          </div>
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#03cd8c]/10 p-3 text-[#03cd8c]"><ShieldCheck className="h-5 w-5" /></div>
              <div className="text-xl font-black">High trust by design</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">FaithHub is designed for quality, moderation, role control, approvals, audit visibility, and thoughtful experiences across sensitive faith and community contexts.</p>
          </div>
        </motion.div>
      </section>

      <section className="pb-20 pt-10 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-slate-950 px-8 py-12 shadow-[0_30px_80px_rgba(15,23,42,0.16)] lg:px-12 lg:py-16">
            <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#03cd8c]/25 blur-3xl" />
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#f77f00]/20 blur-3xl" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#03cd8c]">Ready to begin</div>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Launch your institution, ministry, or creator presence on FaithHub.
                </h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
                  Build a persuasive digital presence for live ministry, teachings, books, resources, community, events, giving, and Beacon promotion — all in one premium destination.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  className="rounded-2xl bg-[#03cd8c] px-6 py-4 text-base font-black text-white shadow-[0_16px_35px_rgba(3,205,140,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(3,205,140,0.34)]"
                  onClick={() => navigate("/faithhub/provider/onboarding")}
                >
                  Get started
                </button>
                <button
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/10"
                  onClick={() => navigate("/faithhub/provider/dashboard")}
                >
                  Book a demo
                </button>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <span className="text-lg font-black">FH</span>
                </div>
                <div>
                  <div className="text-lg font-black tracking-tight">FaithHub</div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Powered by EVzone</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
                A premium digital home for faith communities, ministries, and creators to stream live moments, publish teachings, grow communities, manage giving, and promote what matters beautifully.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <SocialIconButton label="Instagram">
                  <InstagramBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="YouTube">
                  <YoutubeBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="Facebook">
                  <FacebookBrandIcon className="h-5 w-5" />
                </SocialIconButton>
                <SocialIconButton label="Email">
                  <Mail className="h-5 w-5" />
                </SocialIconButton>
              </div>
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">{col.title}</div>
                <div className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="block text-sm font-semibold text-slate-600 transition hover:text-[#03cd8c]">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>© 2026 FaithHub. All rights reserved.</div>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#" className="transition hover:text-[#03cd8c]">Privacy</a>
              <a href="#" className="transition hover:text-[#03cd8c]">Terms</a>
              <a href="#" className="transition hover:text-[#03cd8c]">Support</a>
              <a href="#" className="transition hover:text-[#03cd8c]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
