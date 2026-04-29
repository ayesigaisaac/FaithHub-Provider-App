export type LiveActivityFlow = "builder" | "schedule" | "studio" | "publish";

export type LiveActivityRecord = {
  id: string;
  sessionId: string;
  flow: LiveActivityFlow;
  action: string;
  actorName: string;
  detail?: string;
  atISO: string;
  meta?: Record<string, string | number | boolean>;
};

type LiveActivityState = {
  records: LiveActivityRecord[];
};

const STORAGE_KEY = "faithhub.provider.live.activity.v1";
const UPDATE_EVENT = "faithhub:live-activity-updated";

function inBrowser() {
  return typeof window !== "undefined";
}

function createId() {
  return `liveact_${Math.random().toString(36).slice(2, 10)}`;
}

function readState(): LiveActivityState {
  if (!inBrowser()) return { records: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { records: [] };
    const parsed = JSON.parse(raw) as LiveActivityState;
    if (!parsed || !Array.isArray(parsed.records)) return { records: [] };
    return { records: parsed.records.slice(0, 800) };
  } catch {
    return { records: [] };
  }
}

function writeState(next: LiveActivityState) {
  if (!inBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function recordLiveActivity(input: {
  sessionId: string;
  flow: LiveActivityFlow;
  action: string;
  actorName?: string;
  detail?: string;
  meta?: Record<string, string | number | boolean>;
}) {
  if (!input.sessionId || !input.action.trim()) return;
  const state = readState();
  const next: LiveActivityRecord = {
    id: createId(),
    sessionId: input.sessionId,
    flow: input.flow,
    action: input.action.trim(),
    actorName: input.actorName?.trim() || "Unknown operator",
    detail: input.detail?.trim(),
    atISO: new Date().toISOString(),
    meta: input.meta,
  };
  writeState({ records: [next, ...state.records].slice(0, 800) });
}

export function getLiveActivityRecords(sessionId?: string) {
  const records = readState().records;
  if (!sessionId) return records;
  return records.filter((record) => record.sessionId === sessionId);
}

export function subscribeToLiveActivity(listener: () => void): () => void {
  if (!inBrowser()) return () => {};
  const wrapped = () => listener();
  window.addEventListener(UPDATE_EVENT, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(UPDATE_EVENT, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}

export function exportLiveActivityCsv(records: LiveActivityRecord[], filename = "live_activity_audit.csv") {
  if (!inBrowser()) return;
  const header = ["Timestamp", "Session ID", "Flow", "Action", "Actor", "Detail"];
  const rows = records.map((record) => [
    record.atISO,
    record.sessionId,
    record.flow,
    record.action,
    record.actorName,
    record.detail || "",
  ]);
  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
