import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StandaloneTeachingBuilderPage from "./StandaloneTeachingBuilder";

const navigateWithRouterMock = vi.fn();

vi.mock("@/navigation/routerNavigate", () => ({
  navigateWithRouter: (target: string) => navigateWithRouterMock(target),
}));
vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({ role: "leadership" }),
  useOptionalAuth: () => ({ role: "leadership" }),
}));

describe("Standalone Teaching Builder button wiring", () => {
  it("opens live builder when create live session is clicked", () => {
    render(<StandaloneTeachingBuilderPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /create live session/i })[0]);
    expect(navigateWithRouterMock).toHaveBeenCalledWith("/faithhub/provider/live-builder");
  });

  it("publishes and routes to post-live publishing when publish is clicked", () => {
    render(<StandaloneTeachingBuilderPage />);

    const publish = screen.getByRole("button", { name: /publish teaching/i });
    if (publish.hasAttribute("disabled")) {
      fireEvent.click(screen.getAllByRole("button", { name: /create live session/i })[0]);
    }
    fireEvent.click(screen.getByRole("button", { name: /^publish teaching$/i }));

    expect(navigateWithRouterMock).toHaveBeenCalledWith("/faithhub/provider/post-live-publishing");
  });
});

