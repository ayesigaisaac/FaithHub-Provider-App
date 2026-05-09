import { getAppEnv } from "@/config/env";
import { localLiveSessionsApi } from "@/api/live/localLiveSessionsApi";
import type { LiveSessionsApi } from "@/api/live/types";

function createLiveSessionsApi(): LiveSessionsApi {
  const env = getAppEnv();

  if (env.useSupabase) {
    // Phase 1 foundation: keep local adapter as safe fallback until remote adapter is introduced.
    return localLiveSessionsApi;
  }

  return localLiveSessionsApi;
}

export const liveSessionsApi = createLiveSessionsApi();

