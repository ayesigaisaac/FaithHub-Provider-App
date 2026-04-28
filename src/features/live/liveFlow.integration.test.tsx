import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FaithHubLiveBuilderPage from "@/pages/provider/raw/FH-P-030_LiveBuilder";
import FaithHubLiveSchedulePage from "@/pages/provider/raw/FH-P-031_LiveSchedule";
import FaithHubLiveDashboardPage from "@/pages/provider/raw/FH-P-032_LiveDashboard";
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

      const activeSessionSelect = await screen.findByRole("combobox");
      expect(activeSessionSelect).toHaveValue(saved.id);
    },
    20000,
  );
});
