import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import FaithHubHomeLandingPage from "./FaithHubHomeLandingPage";
import { ThemeModeProvider } from "@/contexts/ThemeModeContext";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const AUTH_TOKEN_KEY = "faithhub.auth.token";
const AUTH_WORKSPACE_KEY = "faithhub.auth.workspace";
const PROFILE_PREFS_KEY = "faithhub.provider.profile.prefs.v1";

function seedAuth() {
  localStorage.setItem(AUTH_TOKEN_KEY, "mock-token");
}

function renderHomePage() {
  return render(
    <ThemeModeProvider>
      <MemoryRouter>
        <FaithHubHomeLandingPage />
      </MemoryRouter>
    </ThemeModeProvider>,
  );
}

describe("FaithHubHomeLandingPage Provider Profiles", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate.mockReset();
    seedAuth();
  });

  it("renders provider profile card using saved workspace and profile preferences", async () => {
    localStorage.setItem(
      AUTH_WORKSPACE_KEY,
      JSON.stringify({
        campus: "Mbarara City Campus",
        brand: "Revival House",
      }),
    );
    localStorage.setItem(
      PROFILE_PREFS_KEY,
      JSON.stringify({
        displayName: "Pastor Isaac",
        title: "Lead Pastor",
        language: "English",
        timezone: "Africa/Kampala",
      }),
    );

    renderHomePage();

    expect(await screen.findByText("Revival House")).toBeInTheDocument();
    expect(screen.getByText("Mbarara City Campus • Online")).toBeInTheDocument();
    expect(screen.getByText("Lead Pastor Intro")).toBeInTheDocument();
    expect(screen.getByText("Weekly • Africa/Kampala")).toBeInTheDocument();
  });

  it("falls back to curated provider profiles when saved data is unavailable", async () => {
    renderHomePage();

    expect(await screen.findByText("Restoration House Global")).toBeInTheDocument();
    expect(screen.getByText("Welcome from Lead Pastor")).toBeInTheDocument();
  });

  it("routes to devotionals from the community hub CTA", async () => {
    renderHomePage();

    const openDevotionals = await screen.findByRole("button", { name: /open devotionals/i });
    fireEvent.click(openDevotionals);

    expect(mockNavigate).toHaveBeenCalledWith("/faithhub/provider/devotionals");
  });
});
