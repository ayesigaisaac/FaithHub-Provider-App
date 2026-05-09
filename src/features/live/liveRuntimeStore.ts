export type LiveRuntimeStatus = "Draft" | "Scheduled" | "Live" | "Ended";
export type LiveRuntimeDestinationStatus = "Healthy" | "Delayed" | "Failed" | "Standby" | "Connected" | "Blocked";

export type LiveRuntimeRecord = {
  sessionId: string;
  status: LiveRuntimeStatus;
  recordingOn: boolean;
  destinations: Record<string, LiveRuntimeDestinationStatus>;
  updatedAtISO: string;
};

type LiveRuntimeState = {
  sessions: Record<string, LiveRuntimeRecord>;
};

const STORAGE_KEY = "faithhub.provider.live.runtime.v1";
const UPDATE_EVENT = "faithhub:live-runtime-updated";

function inBrowser() {
  return typeof window !== "undefined";
}

function readState(): LiveRuntimeState {
  if (!inBrowser()) return { sessions: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: {} };
    const parsed = JSON.parse(raw) as LiveRuntimeState;
    if (!parsed || typeof parsed !== "object" || !parsed.sessions || typeof parsed.sessions !== "object") {
      return { sessions: {} };
    }
    return parsed;
  } catch {
    return { sessions: {} };
  }
}

function writeState(next: LiveRuntimeState) {
  if (!inBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

function upsertSession(sessionId: string): LiveRuntimeRecord {
  const state = readState();
  return (
    state.sessions[sessionId] ?? {
      sessionId,
      status: "Scheduled",
      recordingOn: true,
      destinations: {},
      updatedAtISO: new Date().toISOString(),
    }
  );
}

export function getLiveRuntimeState(): LiveRuntimeState {
  return readState();
}

export function getLiveRuntimeBySessionId(sessionId: string): LiveRuntimeRecord | null {
  if (!sessionId) return null;
  return readState().sessions[sessionId] ?? null;
}

export function setLiveRuntimeStatus(sessionId: string, status: LiveRuntimeStatus) {
  if (!sessionId) return;
  const state = readState();
  const current = upsertSession(sessionId);
  state.sessions[sessionId] = {
    ...current,
    status,
    updatedAtISO: new Date().toISOString(),
  };
  writeState(state);
}

export function setLiveRuntimeRecording(sessionId: string, recordingOn: boolean) {
  if (!sessionId) return;
  const state = readState();
  const current = upsertSession(sessionId);
  state.sessions[sessionId] = {
    ...current,
    recordingOn,
    updatedAtISO: new Date().toISOString(),
  };
  writeState(state);
}

export function setLiveRuntimeDestination(
  sessionId: string,
  destinationName: string,
  status: LiveRuntimeDestinationStatus,
) {
  if (!sessionId || !destinationName.trim()) return;
  const state = readState();
  const current = upsertSession(sessionId);
  state.sessions[sessionId] = {
    ...current,
    destinations: {
      ...current.destinations,
      [destinationName.trim()]: status,
    },
    updatedAtISO: new Date().toISOString(),
  };
  writeState(state);
}

export function subscribeToLiveRuntime(listener: () => void): () => void {
  if (!inBrowser()) return () => {};
  const wrapped = () => listener();
  window.addEventListener(UPDATE_EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(UPDATE_EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

