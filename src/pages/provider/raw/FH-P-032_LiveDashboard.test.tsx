import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LiveDashboardPage from "./FH-P-032_LiveDashboard";

vi.mock("@/navigation/routerNavigate", () => ({
  navigateWithRouter: vi.fn(),
}));

describe("FH-P-032 Live Dashboard interactions", () => {
  it("supports raise-hand, prayer request, and live comments", async () => {
    render(<LiveDashboardPage />);

    const raiseHandButton = await screen.findByRole("button", { name: /raise hand for prayer/i });
    expect(raiseHandButton).toHaveTextContent("Raise hand for prayer · 0");
    fireEvent.click(raiseHandButton);
    expect(raiseHandButton).toHaveTextContent("Raise hand for prayer · 1");

    const prayerRequestButton = screen.getByRole("button", { name: /add prayer request/i });
    expect(prayerRequestButton).toHaveTextContent("Prayer requests · 0");
    fireEvent.click(prayerRequestButton);
    expect(prayerRequestButton).toHaveTextContent("Prayer requests · 1");

    fireEvent.change(screen.getByRole("textbox", { name: /live comment input/i }), {
      target: { value: "Praying in agreement right now." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send live comment/i }));
    expect(screen.getByText(/latest: praying in agreement right now\./i)).toBeInTheDocument();
  });
});

