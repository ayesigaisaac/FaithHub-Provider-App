export type PublishingState = 'Draft' | 'Scheduled' | 'Published';

export type TeachingSeriesRecord = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  speaker: string;
  episodeTarget: number;
  publishingState: PublishingState;
  updatedAtISO: string;
};

export type TeachingEpisodeRecord = {
  id: string;
  title: string;
  parentSeriesId: string | null;
  parentSeriesTitle: string;
  focusStatement: string;
  scripture: string;
  speaker: string;
  publishingState: PublishingState;
  updatedAtISO: string;
};

export type TeachingFlowState = {
  series: TeachingSeriesRecord[];
  episodes: TeachingEpisodeRecord[];
};

export type SeriesDraftInput = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  speaker: string;
  episodeTarget: number;
  publishingState: PublishingState;
};

export type EpisodeDraftInput = {
  id?: string;
  title: string;
  parentSeriesTitle: string;
  parentSeriesId?: string | null;
  focusStatement: string;
  scripture: string;
  speaker: string;
  publishingState: PublishingState;
};

const STORAGE_KEY = 'faithhub.provider.teachings.flow.v1';
const UPDATE_EVENT = 'faithhub:teachings-flow-updated';

const EMPTY_STATE: TeachingFlowState = {
  series: [],
  episodes: [],
};

function inBrowser(): boolean {
  return typeof window !== 'undefined';
}

function createId(prefix: 'series' | 'episode'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePublishingState(input: unknown): PublishingState {
  if (input === 'Published') return 'Published';
  if (input === 'Scheduled') return 'Scheduled';
  return 'Draft';
}

function normalizeState(input: Partial<TeachingFlowState> | null | undefined): TeachingFlowState {
  if (!input) return EMPTY_STATE;

  const safeSeries = Array.isArray(input.series)
    ? input.series.filter(Boolean).map((item) => ({
        id: typeof item.id === 'string' ? item.id : createId('series'),
        title: typeof item.title === 'string' ? item.title : '',
        subtitle: typeof item.subtitle === 'string' ? item.subtitle : '',
        description: typeof item.description === 'string' ? item.description : '',
        speaker: typeof item.speaker === 'string' ? item.speaker : 'Unassigned',
        episodeTarget:
          typeof item.episodeTarget === 'number' && Number.isFinite(item.episodeTarget)
            ? Math.max(0, Math.round(item.episodeTarget))
            : 0,
        publishingState: normalizePublishingState(item.publishingState),
        updatedAtISO:
          typeof item.updatedAtISO === 'string' && item.updatedAtISO.trim()
            ? item.updatedAtISO
            : new Date().toISOString(),
      }))
    : [];

  const safeEpisodes = Array.isArray(input.episodes)
    ? input.episodes.filter(Boolean).map((item) => ({
        id: typeof item.id === 'string' ? item.id : createId('episode'),
        title: typeof item.title === 'string' ? item.title : '',
        parentSeriesId: typeof item.parentSeriesId === 'string' ? item.parentSeriesId : null,
        parentSeriesTitle: typeof item.parentSeriesTitle === 'string' ? item.parentSeriesTitle : '',
        focusStatement: typeof item.focusStatement === 'string' ? item.focusStatement : '',
        scripture: typeof item.scripture === 'string' ? item.scripture : '',
        speaker: typeof item.speaker === 'string' ? item.speaker : 'Unassigned',
        publishingState: normalizePublishingState(item.publishingState),
        updatedAtISO:
          typeof item.updatedAtISO === 'string' && item.updatedAtISO.trim()
            ? item.updatedAtISO
            : new Date().toISOString(),
      }))
    : [];

  return {
    series: safeSeries.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
    episodes: safeEpisodes.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
  };
}

function readState(): TeachingFlowState {
  if (!inBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return normalizeState(JSON.parse(raw) as TeachingFlowState);
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(next: TeachingFlowState): void {
  if (!inBrowser()) return;
  const normalized = normalizeState(next);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

function upsertById<T extends { id: string }>(items: T[], next: T): T[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index < 0) return [next, ...items];
  const clone = [...items];
  clone[index] = next;
  return clone;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function getTeachingFlowState(): TeachingFlowState {
  return readState();
}

export function validateSeriesDraft(input: {
  title: string;
  subtitle: string;
  description: string;
  speaker: string;
}): string[] {
  const errors: string[] = [];

  if (normalizeText(input.title).length < 4) {
    errors.push('Series title must be at least 4 characters.');
  }
  if (normalizeText(input.subtitle).length < 8) {
    errors.push('Series subtitle must be at least 8 characters.');
  }
  if (normalizeText(input.description).length < 20) {
    errors.push('Series description must be at least 20 characters.');
  }
  if (normalizeText(input.speaker).length < 2) {
    errors.push('Please select a primary speaker.');
  }

  return errors;
}

export function validateEpisodeDraft(input: {
  title: string;
  parentSeriesTitle: string;
  focusStatement: string;
  scripture: string;
}): string[] {
  const errors: string[] = [];

  if (normalizeText(input.title).length < 4) {
    errors.push('Episode title must be at least 4 characters.');
  }
  if (normalizeText(input.parentSeriesTitle).length < 3) {
    errors.push('Episode must be linked to a valid series title.');
  }
  if (normalizeText(input.focusStatement).length < 12) {
    errors.push('Episode focus statement must be at least 12 characters.');
  }
  if (normalizeText(input.scripture).length < 3) {
    errors.push('Scripture or core idea is required.');
  }

  return errors;
}

export function saveSeriesDraft(input: SeriesDraftInput): TeachingSeriesRecord {
  const state = readState();
  const nowISO = new Date().toISOString();
  const next: TeachingSeriesRecord = {
    id: input.id ?? createId('series'),
    title: normalizeText(input.title),
    subtitle: normalizeText(input.subtitle),
    description: normalizeText(input.description),
    speaker: normalizeText(input.speaker) || 'Unassigned',
    episodeTarget: Math.max(0, Math.round(input.episodeTarget || 0)),
    publishingState: input.publishingState,
    updatedAtISO: nowISO,
  };

  writeState({
    ...state,
    series: upsertById(state.series, next).sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
  });
  return next;
}

export function publishSeries(input: SeriesDraftInput): TeachingSeriesRecord {
  return saveSeriesDraft({ ...input, publishingState: 'Published' });
}

export function saveEpisodeDraft(input: EpisodeDraftInput): TeachingEpisodeRecord {
  const state = readState();
  const nowISO = new Date().toISOString();
  const inferredSeries =
    state.series.find((series) => series.id === input.parentSeriesId) ??
    state.series.find((series) => series.title.toLowerCase() === input.parentSeriesTitle.trim().toLowerCase()) ??
    null;

  const next: TeachingEpisodeRecord = {
    id: input.id ?? createId('episode'),
    title: normalizeText(input.title),
    parentSeriesId: inferredSeries?.id ?? input.parentSeriesId ?? null,
    parentSeriesTitle: normalizeText(input.parentSeriesTitle) || inferredSeries?.title || '',
    focusStatement: normalizeText(input.focusStatement),
    scripture: normalizeText(input.scripture),
    speaker: normalizeText(input.speaker) || 'Unassigned',
    publishingState: input.publishingState,
    updatedAtISO: nowISO,
  };

  writeState({
    ...state,
    episodes: upsertById(state.episodes, next).sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
  });
  return next;
}

export function publishEpisode(input: EpisodeDraftInput): TeachingEpisodeRecord {
  return saveEpisodeDraft({ ...input, publishingState: 'Published' });
}

export function subscribeToTeachingFlow(listener: () => void): () => void {
  if (!inBrowser()) return () => {};

  const wrapped = () => listener();
  window.addEventListener(UPDATE_EVENT, wrapped);
  window.addEventListener('storage', wrapped);
  return () => {
    window.removeEventListener(UPDATE_EVENT, wrapped);
    window.removeEventListener('storage', wrapped);
  };
}
