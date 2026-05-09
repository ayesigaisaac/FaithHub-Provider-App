import {
  getLiveFlowSessionById,
  getLiveFlowState,
  saveLiveFlowDraft,
  scheduleLiveFlowSession,
  subscribeToLiveFlow,
  type LiveFlowDraftInput,
} from "@/features/live/liveFlowStore";
import type { LiveSessionsApi } from "@/api/live/types";

export const localLiveSessionsApi: LiveSessionsApi = {
  getState: () => getLiveFlowState(),
  getById: (id: string) => getLiveFlowSessionById(id),
  saveDraft: (input: LiveFlowDraftInput) => saveLiveFlowDraft(input),
  schedule: (input: LiveFlowDraftInput) => scheduleLiveFlowSession(input),
  subscribe: (listener: () => void) => subscribeToLiveFlow(listener),
};

