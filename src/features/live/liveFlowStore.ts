export type LiveFlowStatus = "Draft" | "Ready" | "Scheduled";

export type LiveParentType =
  | "Series Episode"
  | "Standalone Teaching"
  | "Event"
  | "Giving Moment"
  | "Standalone Live";

export type LiveFlowRecord = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  parentLabel: string;
  parentType: LiveParentType;
  sessionType: string;
  campus: string;
  language: string;
  audience: string;
  speaker: string;
  startISO: string;
  endISO: string;
  timezone: string;
  status: LiveFlowStatus;
  updatedAtISO: string;
};

export type LiveFlowState = {
  sessions: LiveFlowRecord[];
};

export type LiveFlowDraftInput = Omit<LiveFlowRecord, "updatedAtISO"> & {
  id?: string;
};

const STORAGE_KEY = "faithhub.provider.live.flow.v1";
const UPDATE_EVENT = "faithhub:live-flow-updated";

function inBrowser() {
  return typeof window !== "undefined";
}

function createId() {
  return `live_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeStatus(input: unknown): LiveFlowStatus {
  if (input === "Scheduled") return "Scheduled";
  if (input === "Ready") return "Ready";
  return "Draft";
}

function normalizeParentType(input: unknown): LiveParentType {
  if (
    input === "Series Episode" ||
    input === "Standalone Teaching" ||
    input === "Event" ||
    input === "Giving Moment"
  ) {
    return input;
  }
  return "Standalone Live";
}

function normalizeState(input: Partial<LiveFlowState> | null | undefined): LiveFlowState {
  if (!input || !Array.isArray(input.sessions)) {
    return { sessions: [] };
  }

  return {
    sessions: input.sessions
      .map((session) => ({
        id: typeof session.id === "string" ? session.id : createId(),
        title: typeof session.title === "string" ? session.title : "",
        subtitle: typeof session.subtitle === "string" ? session.subtitle : "",
        summary: typeof session.summary === "string" ? session.summary : "",
        parentLabel: typeof session.parentLabel === "string" ? session.parentLabel : "Standalone Live",
        parentType: normalizeParentType(session.parentType),
        sessionType: typeof session.sessionType === "string" ? session.sessionType : "Special Event",
        campus: typeof session.campus === "string" ? session.campus : "Online Campus",
        language: typeof session.language === "string" ? session.language : "English",
        audience: typeof session.audience === "string" ? session.audience : "All Church",
        speaker: typeof session.speaker === "string" ? session.speaker : "Unassigned",
        startISO: typeof session.startISO === "string" ? session.startISO : "",
        endISO: typeof session.endISO === "string" ? session.endISO : "",
        timezone: typeof session.timezone === "string" ? session.timezone : "Africa/Kampala",
        status: normalizeStatus(session.status),
        updatedAtISO:
          typeof session.updatedAtISO === "string" && session.updatedAtISO.trim()
            ? session.updatedAtISO
            : new Date().toISOString(),
      }))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
  };
}

function readState(): LiveFlowState {
  if (!inBrowser()) return { sessions: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] };
    return normalizeState(JSON.parse(raw) as LiveFlowState);
  } catch {
    return { sessions: [] };
  }
}

function writeState(next: LiveFlowState): void {
  if (!inBrowser()) return;
  const normalized = normalizeState(next);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

function upsert(items: LiveFlowRecord[], next: LiveFlowRecord) {
  const index = items.findIndex((item) => item.id === next.id);
  if (index < 0) return [next, ...items];
  const clone = [...items];
  clone[index] = next;
  return clone;
}

function clean(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function getLiveFlowState(): LiveFlowState {
  return readState();
}

export function getLiveFlowSessionById(id: string): LiveFlowRecord | null {
  if (!id) return null;
  const state = readState();
  return state.sessions.find((session) => session.id === id) ?? null;
}

export function validateLiveFlowDraft(input: {
  title: string;
  speaker: string;
  startISO: string;
  endISO: string;
  timezone: string;
}): string[] {
  const errors: string[] = [];
  if (clean(input.title).length < 4) errors.push("Live session title must be at least 4 characters.");
  if (clean(input.speaker).length < 2) errors.push("Host/speaker is required.");
  if (!clean(input.startISO)) errors.push("Start date/time is required.");
  if (!clean(input.endISO)) errors.push("End date/time is required.");
  if (!clean(input.timezone)) errors.push("Timezone is required.");
  if (clean(input.startISO) && clean(input.endISO) && input.startISO >= input.endISO) {
    errors.push("End time must be after start time.");
  }
  return errors;
}

export function saveLiveFlowDraft(input: LiveFlowDraftInput): LiveFlowRecord {
  const state = readState();
  const next: LiveFlowRecord = {
    id: input.id ?? createId(),
    title: clean(input.title),
    subtitle: clean(input.subtitle),
    summary: clean(input.summary),
    parentLabel: clean(input.parentLabel) || "Standalone Live",
    parentType: normalizeParentType(input.parentType),
    sessionType: clean(input.sessionType) || "Special Event",
    campus: clean(input.campus) || "Online Campus",
    language: clean(input.language) || "English",
    audience: clean(input.audience) || "All Church",
    speaker: clean(input.speaker) || "Unassigned",
    startISO: clean(input.startISO),
    endISO: clean(input.endISO),
    timezone: clean(input.timezone) || "Africa/Kampala",
    status: normalizeStatus(input.status),
    updatedAtISO: new Date().toISOString(),
  };

  writeState({
    sessions: upsert(state.sessions, next).sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO)),
  });

  return next;
}

export function scheduleLiveFlowSession(input: LiveFlowDraftInput): LiveFlowRecord {
  return saveLiveFlowDraft({ ...input, status: "Scheduled" });
}

export function subscribeToLiveFlow(listener: () => void): () => void {
  if (!inBrowser()) return () => {};

  const wrapped = () => listener();
  window.addEventListener(UPDATE_EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(UPDATE_EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}
