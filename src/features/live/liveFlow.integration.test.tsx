import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FaithHubLiveBuilderPage from "@/pages/provider/raw/FH-P-030_LiveBuilder";
import FaithHubLiveSchedulePage from "@/pages/provider/raw/FH-P-031_LiveSchedule";
import FaithHubLiveDashboardPage from "@/pages/provider/raw/FH-P-032_LiveDashboard";
import FaithHubLiveStudioPage from "@/pages/provider/raw/FH-P-033_LiveStudio";
import { getLiveFlowState } from "./liveFlowStore";

describe("Live flow integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it(
    "saves in builder and appears in schedule and dashboard by sessionId",
    async () => {
      const builder = render(<FaithHubLiveBuilderPage />);

      const saveButton = await screen.findByRole("button", { name: /save live session/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(getLiveFlowState().sessions.length).toBeGreaterThan(0);
      });

      const saved = getLiveFlowState().sessions[0];
      expect(saved).toBeTruthy();
      expect(saved.title.length).toBeGreaterThan(0);

      builder.unmount();

      window.history.pushState(
        {},
        "",
        `/faithhub/provider/live-schedule?sessionId=${encodeURIComponent(saved.id)}`,
      );
      const schedule = render(<FaithHubLiveSchedulePage />);

      const scheduleTitleMatches = await screen.findAllByText(saved.title);
      expect(scheduleTitleMatches.length).toBeGreaterThan(0);

      schedule.unmount();

      window.history.pushState(
        {},
        "",
        `/faithhub/provider/live-dashboard?sessionId=${encodeURIComponent(saved.id)}`,
      );
      render(<FaithHubLiveDashboardPage />);

      const sessionSelects = await screen.findAllByRole("combobox");
      const activeSessionSelect = sessionSelects[0];
      expect(activeSessionSelect).toHaveValue(saved.id);
    },
    20000,
  );

  it(
    "preserves sessionId from dashboard to live studio and stream-to-platforms",
    async () => {
      const builder = render(<FaithHubLiveBuilderPage />);
      fireEvent.click(await screen.findByRole("button", { name: /save live session/i }));

      await waitFor(() => {
        expect(getLiveFlowState().sessions.length).toBeGreaterThan(0);
      });
      const saved = getLiveFlowState().sessions[0];
      builder.unmount();

      window.history.pushState(
        {},
        "",
        `/faithhub/provider/live-dashboard?sessionId=${encodeURIComponent(saved.id)}`,
      );
      const dashboard = render(<FaithHubLiveDashboardPage />);
      fireEvent.click((await screen.findAllByRole("button", { name: /live studio/i }))[0]);
      expect(window.location.pathname).toBe("/faithhub/provider/live-studio");
      expect(new URLSearchParams(window.location.search).get("sessionId")).toBe(saved.id);
      dashboard.unmount();

      const studio = render(<FaithHubLiveStudioPage />);
      fireEvent.click((await screen.findAllByRole("button", { name: /stream-to-platforms/i }))[0]);
      expect(window.location.pathname).toBe("/faithhub/provider/stream-to-platforms");
      expect(new URLSearchParams(window.location.search).get("sessionId")).toBe(saved.id);
      studio.unmount();
    },
    20000,
  );
});
