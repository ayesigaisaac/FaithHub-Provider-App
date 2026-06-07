import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FaithHubLiveBuilderPage from "@/pages/provider/raw/LiveBuilder";
import FaithHubLiveSchedulePage from "@/pages/provider/raw/LiveSchedule";
import FaithHubLiveDashboardPage from "@/pages/provider/raw/LiveDashboard";
import FaithHubLiveStudioPage from "@/pages/provider/raw/LiveStudio";
import StreamToPlatformsPage from "@/pages/provider/raw/StreamToPlatforms";
import { getLiveFlowState } from "./liveFlowStore";
import { getLiveRuntimeBySessionId } from "./liveRuntimeStore";
import { NotificationProvider } from "@/contexts/NotificationContext";

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

  it(
    "syncs stream destination runtime state for the routed session",
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
        `/faithhub/provider/stream-to-platforms?sessionId=${encodeURIComponent(saved.id)}`,
      );
      render(
        <NotificationProvider>
          <StreamToPlatformsPage />
        </NotificationProvider>,
      );

      await waitFor(() => {
        const runtime = getLiveRuntimeBySessionId(saved.id);
        expect(runtime).toBeTruthy();
        expect(runtime?.destinations["Live Hub"]).toBe("Healthy");
        expect(runtime?.destinations["Custom RTMP Backup"]).toBe("Standby");
      });
    },
    20000,
  );
});

