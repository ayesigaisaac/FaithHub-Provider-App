import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProviderDashboardPage, { deriveTeachingWorkflowData } from "./FH-P-010_ProviderDashboard";

const navigateWithRouterMock = vi.fn();

vi.mock("@/navigation/routerNavigate", () => ({
  navigateWithRouter: (target: string) => navigateWithRouterMock(target),
}));

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({
    user: { name: "Test User" },
    role: "provider",
    workspace: { brand: "FaithHub" },
  }),
}));

describe("FH-P-010 Provider dashboard workflow UX", () => {
  beforeEach(() => {
    navigateWithRouterMock.mockReset();
    vi.useFakeTimers();
  });

  it("renders empty state when no teachings exist", () => {
    render(<ProviderDashboardPage workflowItemsOverride={[]} />);

    expect(screen.getByText("Your dashboard is ready")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start New Task" })).toBeInTheDocument();
  });

  it("shows continue section only when recent teachings exist", () => {
    const withTeaching = [
      {
        id: "item-1",
        title: "Sunday Teaching",
        type: "Teaching",
        status: "Draft" as const,
        owner: "A",
        due: "Today",
      },
    ];
    const withoutTeaching = [
      {
        id: "item-2",
        title: "Community Outreach",
        type: "Campaign",
        status: "Ready to publish" as const,
        owner: "B",
        due: "Today",
      },
    ];

    const { rerender } = render(<ProviderDashboardPage workflowItemsOverride={withTeaching} />);
    expect(screen.getByText("Continue where you left off")).toBeInTheDocument();

    rerender(<ProviderDashboardPage workflowItemsOverride={withoutTeaching} />);
    expect(screen.queryByText("Continue where you left off")).not.toBeInTheDocument();
    expect(screen.getByText("Your dashboard is ready")).toBeInTheDocument();
  });

  it("derives pending work from draft and needs review statuses", () => {
    const data = deriveTeachingWorkflowData([
      {
        id: "a",
        title: "Teaching A",
        type: "Teaching",
        status: "Draft",
        owner: "Owner",
        due: "Today",
      },
      {
        id: "b",
        title: "Series B",
        type: "Series",
        status: "Awaiting review",
        owner: "Owner",
        due: "Today",
      },
      {
        id: "c",
        title: "Episode C",
        type: "Episode",
        status: "Ready to publish",
        owner: "Owner",
        due: "Today",
      },
    ]);

    expect(data.pendingWork.map((item) => item.id)).toEqual(["a", "b"]);
    expect(data.needsReviewCount).toBe(1);
  });

  it("navigates CTA actions using the selected item id", () => {
    const teachingItems = [
      {
        id: "open-me-123",
        title: "Teaching To Open",
        type: "Teaching",
        status: "Draft" as const,
        owner: "Owner",
        due: "Today",
      },
    ];

    render(<ProviderDashboardPage workflowItemsOverride={teachingItems} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByRole("button", { name: "Continue editing" }));
    expect(navigateWithRouterMock).toHaveBeenCalledWith(
      "/faithhub/provider/teachings-dashboard?teachingId=open-me-123",
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Open Teaching To Open/i })[0]);
    expect(navigateWithRouterMock).toHaveBeenLastCalledWith(
      "/faithhub/provider/teachings-dashboard?teachingId=open-me-123",
    );
  });
});
