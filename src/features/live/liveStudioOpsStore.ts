type StudioOpType =
  | "scene_queued"
  | "scene_switched"
  | "clip_marked"
  | "emergency_slate_toggled"
  | "fallback_toggled";

type StudioOpRecord = {
  id: string;
  sessionId: string;
  type: StudioOpType;
  label: string;
  atISO: string;
  meta?: Record<string, string | number | boolean>;
};

type StudioSessionOps = {
  sessionId: string;
  records: StudioOpRecord[];
};

type StudioOpsState = {
  sessions: StudioSessionOps[];
};

export type StudioOpsSummary = {
  clipMarks: Array<{ label: string; atISO: string; timecode?: string }>;
  sceneSwitches: Array<{ label: string; atISO: string }>;
  incidents: Array<{ label: string; atISO: string }>;
};

const STORAGE_KEY = "faithhub.provider.live.studio.ops.v1";
const UPDATE_EVENT = "faithhub:live-studio-ops-updated";

function inBrowser() {
  return typeof window !== "undefined";
}

function createId() {
  return `studioop_${Math.random().toString(36).slice(2, 10)}`;
}

function readState(): StudioOpsState {
  if (!inBrowser()) return { sessions: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] };
    const parsed = JSON.parse(raw) as StudioOpsState;
    if (!parsed || !Array.isArray(parsed.sessions)) return { sessions: [] };
    return parsed;
  } catch {
    return { sessions: [] };
  }
}

function writeState(next: StudioOpsState) {
  if (!inBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function recordStudioOp(input: {
  sessionId: string;
  type: StudioOpType;
  label: string;
  meta?: Record<string, string | number | boolean>;
}): void {
  if (!input.sessionId) return;
  const state = readState();
  const record: StudioOpRecord = {
    id: createId(),
    sessionId: input.sessionId,
    type: input.type,
    label: input.label.trim(),
    atISO: new Date().toISOString(),
    meta: input.meta,
  };

  const index = state.sessions.findIndex((session) => session.sessionId === input.sessionId);
  if (index < 0) {
    state.sessions.unshift({ sessionId: input.sessionId, records: [record] });
  } else {
    const current = state.sessions[index];
    const nextRecords = [record, ...current.records].slice(0, 150);
    state.sessions[index] = { ...current, records: nextRecords };
  }
  writeState(state);
}

export function getStudioOpsSummary(sessionId: string): StudioOpsSummary {
  if (!sessionId) return { clipMarks: [], sceneSwitches: [], incidents: [] };
  const state = readState();
  const session = state.sessions.find((item) => item.sessionId === sessionId);
  if (!session) return { clipMarks: [], sceneSwitches: [], incidents: [] };

  const clipMarks = session.records
    .filter((record) => record.type === "clip_marked")
    .map((record) => ({
      label: record.label,
      atISO: record.atISO,
      timecode: typeof record.meta?.timecode === "string" ? record.meta.timecode : undefined,
    }));

  const sceneSwitches = session.records
    .filter((record) => record.type === "scene_switched")
    .map((record) => ({ label: record.label, atISO: record.atISO }));

  const incidents = session.records
    .filter(
      (record) =>
        record.type === "emergency_slate_toggled" ||
        record.type === "fallback_toggled",
    )
    .map((record) => ({ label: record.label, atISO: record.atISO }));

  return { clipMarks, sceneSwitches, incidents };
}

export function subscribeToStudioOps(listener: () => void): () => void {
  if (!inBrowser()) return () => {};
  const wrapped = () => listener();
  window.addEventListener(UPDATE_EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(UPDATE_EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

