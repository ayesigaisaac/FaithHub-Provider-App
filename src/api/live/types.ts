import type { LiveFlowDraftInput, LiveFlowRecord, LiveFlowState } from "@/features/live/liveFlowStore";

export type LiveSessionsApi = {
  getState: () => LiveFlowState;
  getById: (id: string) => LiveFlowRecord | null;
  saveDraft: (input: LiveFlowDraftInput) => LiveFlowRecord;
  schedule: (input: LiveFlowDraftInput) => LiveFlowRecord;
  subscribe: (listener: () => void) => () => void;
};

