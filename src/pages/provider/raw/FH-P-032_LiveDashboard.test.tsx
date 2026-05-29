import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LiveDashboardPage from "./FH-P-032_LiveDashboard";

vi.mock("@/navigation/routerNavigate", () => ({
  navigateWithRouter: vi.fn(),
}));

vi.mock("@/api/live", () => ({
  liveSessionsApi: {
    getState: () => ({ sessions: [] }),
    subscribe: () => () => {},
  },
}));

vi.mock("@/features/live/liveActivityStore", () => ({
  exportLiveActivityCsv: vi.fn(),
  getLiveActivityRecords: () => [],
  subscribeToLiveActivity: () => () => {},
}));

vi.mock("@/features/live/liveRuntimeStore", () => ({
  getLiveRuntimeState: () => ({ sessions: {} }),
  subscribeToLiveRuntime: () => () => {},
}));

describe("FH-P-032 Live Dashboard interactions", () => {
  beforeEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("supports raise-hand, prayer request, and live comments", () => {
    render(<LiveDashboardPage />);

    const raiseHandButton = screen.getByRole("button", { name: /raise hand for prayer/i });
    expect(raiseHandButton).toHaveTextContent(/Raise hand for prayer.*0/i);
    fireEvent.click(raiseHandButton);
    expect(raiseHandButton).toHaveTextContent(/Raise hand for prayer.*1/i);

    const prayerRequestButton = screen.getByRole("button", { name: /add prayer request/i });
    expect(prayerRequestButton).toHaveTextContent(/Prayer requests.*0/i);
    fireEvent.click(prayerRequestButton);
    expect(prayerRequestButton).toHaveTextContent(/Prayer requests.*1/i);

    fireEvent.change(screen.getByRole("textbox", { name: /live comment input/i }), {
      target: { value: "Praying in agreement right now." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send live comment/i }));
    expect(screen.getByText(/latest: praying in agreement right now\./i)).toBeInTheDocument();
  }, 20000);
});
