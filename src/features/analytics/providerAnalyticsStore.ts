export type ProviderAnalyticsSnapshot = {
  streamsLiveNow: number;
  streamViewers: number;
  followersTotal: number;
  donationsTotal: number;
  engagementSignals: number;
  streamDeltaPct: number;
  followerDeltaPct: number;
  donationDeltaPct: number;
  engagementDeltaLabel: string;
  updatedAtISO: string;
};

const STORAGE_KEY = "fh.provider.analytics.snapshot.v1";

export function buildProviderAnalyticsSnapshot(input: {
  streamsLiveNow: number;
  streamViewers: number;
  followersTotal: number;
  donationsTotal: number;
  engagementSignals: number;
}): ProviderAnalyticsSnapshot {
  const { streamsLiveNow, streamViewers, followersTotal, donationsTotal, engagementSignals } = input;
  return {
    streamsLiveNow,
    streamViewers,
    followersTotal,
    donationsTotal,
    engagementSignals,
    streamDeltaPct: 8,
    followerDeltaPct: 6.8,
    donationDeltaPct: 4.2,
    engagementDeltaLabel: "Healthy and rising",
    updatedAtISO: new Date().toISOString(),
  };
}

export function readProviderAnalyticsSnapshot(): ProviderAnalyticsSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProviderAnalyticsSnapshot;
  } catch {
    return null;
  }
}

export function saveProviderAnalyticsSnapshot(snapshot: ProviderAnalyticsSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // no-op
  }
}

