import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SeriesBuilderPage from "./FH-P-020_SeriesBuilder";

vi.mock("@/navigation/routerNavigate", () => ({
  navigateWithRouter: vi.fn(),
}));
vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({ role: "leadership" }),
}));

describe("FH-P-020 Series Builder button wiring", () => {
  it("duplicates the active draft when duplicate is clicked", () => {
    render(<SeriesBuilderPage />);

    expect(screen.getByDisplayValue("Practicing the Way of Hope")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /duplicate draft/i }));

    expect(screen.getByDisplayValue("Practicing the Way of Hope (Copy)")).toBeInTheDocument();
    expect(screen.getByText("Series draft duplicated.")).toBeInTheDocument();
  });
});
