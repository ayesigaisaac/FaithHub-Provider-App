import { BookOpen, ChevronRight, HeartHandshake, MessageSquareHeart, Users } from 'lucide-react';
import { navigateWithRouter } from '@/navigation/routerNavigate';
import { ProviderPageTitle } from '@/components/provider/ProviderPageTitle';
import { ProviderSectionCard } from '@/components/provider/ProviderSectionCard';
import { ProviderStatusPill } from '@/components/provider/ProviderStatusPill';

type DevotionalPlan = {
  id: string;
  title: string;
  cadence: string;
  audience: string;
  status: 'Draft' | 'Scheduled' | 'Live';
};

const devotionalPlans: DevotionalPlan[] = [
  { id: 'dev-1', title: 'Morning Prayer Journey', cadence: 'Daily - 6:00 AM', audience: 'Prayer wall followers', status: 'Live' },
  { id: 'dev-2', title: 'Family Worship Reflections', cadence: 'Mon, Wed, Fri', audience: 'Family groups', status: 'Scheduled' },
  { id: 'dev-3', title: 'Youth Midweek Devotional', cadence: 'Weekly - Wednesday', audience: 'Youth community', status: 'Draft' },
];

const toneByStatus: Record<DevotionalPlan['status'], 'good' | 'navy' | 'warn'> = {
  Live: 'good',
  Scheduled: 'navy',
  Draft: 'warn',
};

export default function FH_P_107_Devotionals() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6 px-4 py-4 sm:px-6 sm:py-6">
      <ProviderPageTitle
        icon={<BookOpen className="h-5 w-5" />}
        title="Devotionals"
        subtitle="Create and schedule daily or weekly devotional journeys connected to prayer, testimonies, and groups."
      />

      <ProviderSectionCard
        title="Community devotional lanes"
        subtitle="Quickly open connected care surfaces while keeping devotional continuity."
        right={<ProviderStatusPill tone="brand">FaithHub Community</ProviderStatusPill>}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Prayer Wall', route: '/faithhub/provider/prayer-requests', icon: <HeartHandshake className="h-4 w-4" /> },
            { label: 'Testimonies', route: '/faithhub/provider/testimonies', icon: <MessageSquareHeart className="h-4 w-4" /> },
            { label: 'Groups', route: '/faithhub/provider/community-groups', icon: <Users className="h-4 w-4" /> },
            { label: 'Prayer Journal', route: '/faithhub/provider/prayer-journal', icon: <BookOpen className="h-4 w-4" /> },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigateWithRouter(item.route)}
              className="flex min-h-11 items-center justify-between rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-3.5 py-2.5 text-left transition hover:bg-[var(--fh-surface)]"
            >
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-faith-ink">
                {item.icon}
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>
          ))}
        </div>
      </ProviderSectionCard>

      <ProviderSectionCard
        title="Active devotional plans"
        subtitle="Track cadence, audience fit, and readiness across your current devotional library."
      >
        <div className="space-y-3">
          {devotionalPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-faith-line/70 bg-[var(--fh-surface-bg)] px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[14px] font-bold text-faith-ink">{plan.title}</div>
                <ProviderStatusPill tone={toneByStatus[plan.status]}>{plan.status}</ProviderStatusPill>
              </div>
              <div className="mt-1 text-[12px] text-slate-700">{plan.cadence}</div>
              <div className="mt-1 text-[12px] text-slate-600">{plan.audience}</div>
            </div>
          ))}
        </div>
      </ProviderSectionCard>
    </div>
  );
}
