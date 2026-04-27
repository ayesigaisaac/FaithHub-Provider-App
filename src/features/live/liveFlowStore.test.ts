import {
  getLiveFlowSessionById,
  getLiveFlowState,
  saveLiveFlowDraft,
  scheduleLiveFlowSession,
  validateLiveFlowDraft,
} from "./liveFlowStore";

describe("liveFlowStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("validates required live flow fields", () => {
    expect(
      validateLiveFlowDraft({
        title: "x",
        speaker: "",
        startISO: "",
        endISO: "",
        timezone: "",
      }),
    ).toHaveLength(5);
  });

  it("saves and schedules live sessions", () => {
    const draft = saveLiveFlowDraft({
      title: "Sunday Encounter Live",
      subtitle: "Main weekly service",
      summary: "Service with worship, teaching, and prayer response.",
      parentLabel: "Series Episode: Sunday Encounter",
      parentType: "Series Episode",
      sessionType: "Weekly Service",
      campus: "Central Campus",
      language: "English",
      audience: "All Church",
      speaker: "Pastor Daniel M.",
      startISO: "2026-04-19T09:00:00",
      endISO: "2026-04-19T10:30:00",
      timezone: "Africa/Kampala",
      status: "Draft",
    });

    expect(getLiveFlowState().sessions[0]?.status).toBe("Draft");

    const scheduled = scheduleLiveFlowSession({
      ...draft,
      status: "Scheduled",
    });

    expect(scheduled.id).toBe(draft.id);
    expect(getLiveFlowState().sessions[0]?.status).toBe("Scheduled");
    expect(getLiveFlowSessionById(draft.id)?.title).toBe("Sunday Encounter Live");
  });
});
