import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, expect, beforeEach, afterEach } from "vitest";
import HomePage from "@/components/HomePage";

vi.mock("@/components/TopPerformers", () => ({
  default: () => <div data-testid="top-performers">Mock TopPerformers</div>,
}));

vi.mock("@/components/LiveOddsPage", () => ({
  default: () => <div data-testid="live-odds">LiveOddsPage Component</div>,
}));

vi.mock("@/hooks/useTopPerformersDate", () => ({
  default: () => ({
    date: "05-15-2025",
    error: null,
  }),
}));

vi.mock("@/hooks/useLeaders", () => ({
  default: () => ({
    pointLeaders: [],
    assistLeaders: [],
    reboundLeaders: [],
    stealLeaders: [],
    blockLeaders: [],
    isLoading: false,
  }),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: () => ({
      data: { gameIds: ["001"], shouldRefreshStats: false },
      isLoading: false,
      error: null,
    }),
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); // to restore global mocks, if they were overridden
  });

  test("renders top performers by default", () => {
    render(<HomePage />);
    expect(screen.getByTestId("top-performers")).toBeInTheDocument();
    expect(screen.queryByTestId("live-odds")).not.toBeInTheDocument();
  });

  test("renders live odds when toggled", async () => {
    render(<HomePage />);
    const liveOddsTab = screen.getByText(/Live Odds/i);
    fireEvent.click(liveOddsTab);

    await waitFor(() => {
      expect(screen.getByTestId("live-odds")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("top-performers")).not.toBeInTheDocument();
  });

  test("renders heading for today", async () => {
    // override mock to return today's date
    vi.doMock("@/hooks/useTopPerformersDate", () => {
      const today = new Date();
      const formatted = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}-${today.getFullYear()}`;
      return {
        default: () => ({ date: formatted, error: null }),
      };
    });

    const { default: HomePageReloaded } = await import("@/components/HomePage");
    render(<HomePageReloaded />);

    expect(screen.getByText(/Today's Top Performers/)).toBeInTheDocument();
  });

  test("renders heading for yesterday", async () => {
    // override mock to return yesterday's date
    vi.doMock("@/hooks/useTopPerformersDate", () => {
      const yesterday = new Date(Date.now() - 86400000);
      const formatted = `${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}-${yesterday.getFullYear()}`;
      return {
        default: () => ({ date: formatted, error: null }),
      };
    });

    const { default: HomePageReloaded } = await import("@/components/HomePage");
    render(<HomePageReloaded />);

    expect(
      screen.getByText(/Top Performers from Yesterday/),
    ).toBeInTheDocument();
  });

  test("renders heading for specific date", async () => {
    // override mock to return yesterday's date
    vi.doMock("@/hooks/useTopPerformersDate", () => {
      return {
        default: () => ({ date: "04-16-2025", error: null }),
      };
    });

    const { default: HomePageReloaded } = await import("@/components/HomePage");
    render(<HomePageReloaded />);

    expect(
      screen.getByText(/Top Performers from April 16th/),
    ).toBeInTheDocument();
  });

  test("renders heading for today if date is undefined", async () => {
    vi.doMock("@/hooks/useTopPerformersDate", () => ({
      default: () => ({ date: undefined, error: null }),
    }));

    const { default: HomePageReloaded } = await import("@/components/HomePage");
    render(<HomePageReloaded />);
    expect(screen.getByText(/Today's Top Performers/)).toBeInTheDocument();
  });

  test("still renders TopPerformers even if useLeaders is loading", async () => {
    vi.doMock("@/hooks/useLeaders", () => ({
      default: () => ({
        pointLeaders: [],
        assistLeaders: [],
        reboundLeaders: [],
        stealLeaders: [],
        blockLeaders: [],
        isLoading: true,
      }),
    }));

    const { default: HomePageReloaded } = await import("@/components/HomePage");
    render(<HomePageReloaded />);
    expect(screen.getByTestId("top-performers")).toBeInTheDocument();
  });
});
