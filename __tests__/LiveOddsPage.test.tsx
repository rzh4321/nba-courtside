import { render, screen } from "@testing-library/react";
import { describe, test, vi, expect } from "vitest";
import LiveOddsPage from "@/components/LiveOddsPage";
import useTodaysOdds from "@/hooks/useTodaysOdds";

vi.mock("@/hooks/useTodaysOdds", () => ({
  default: vi.fn(),
}));

vi.mock("@/components/OddsRow", () => ({
  default: ({ isAwayTeam }: any) => (
    <div data-testid="odds-row">{isAwayTeam ? "AWAY" : "HOME"}</div>
  ),
}));

describe("LiveOddsPage", () => {
  const mockGame = {
    id: "1",
    gameId: "game-1",
    gameDate: "2025-05-16",
    awayTeam: "BKN",
    homeTeam: "NYK",
    awaySpreadOdds: 110,
    homeSpreadOdds: -110,
    awayMoneyline: 120,
    homeMoneyline: -130,
    overOdds: 105,
    overUnder: 215.5,
    openingOverUnder: 213,
    homeSpread: -4.5,
    openingHomeSpread: -3.5,
    hasEnded: false,
  };

  test("shows loading placeholders when loading is true", () => {
    (useTodaysOdds as any).mockReturnValue({
      loading: true,
      todaysOdds: [],
      error: null,
      isConnected: true,
    });

    render(<LiveOddsPage />);
    expect(screen.getAllByTestId("loading")).toHaveLength(3); // 3 loading divs
  });

  test("shows error message if error is present and no odds", () => {
    (useTodaysOdds as any).mockReturnValue({
      loading: false,
      todaysOdds: [],
      error: "Server down",
      isConnected: true,
    });

    render(<LiveOddsPage />);
    expect(
      screen.getByText(/live odds may be temporarily unavailable/i),
    ).toBeInTheDocument();
  });

  test("shows no games message if no odds and no error", () => {
    (useTodaysOdds as any).mockReturnValue({
      loading: false,
      todaysOdds: [],
      error: null,
      isConnected: true,
    });

    render(<LiveOddsPage />);
    expect(
      screen.getByText(/There are no scheduled games today./i),
    ).toBeInTheDocument();
  });

  test("renders OddsRows for each game (2 per game)", () => {
    (useTodaysOdds as any).mockReturnValue({
      loading: false,
      todaysOdds: [["MAY 16", [mockGame]]],
      error: null,
      isConnected: true,
    });

    render(<LiveOddsPage />);
    const rows = screen.getAllByTestId("odds-row");
    expect(rows).toHaveLength(2); // 1 game → 2 rows (away + home)

    expect(screen.getByText("MAY 16")).toBeInTheDocument(); // header shown
  });

  test("shows connection warning if isConnected is false", () => {
    (useTodaysOdds as any).mockReturnValue({
      loading: false,
      todaysOdds: [["MAY 16", [mockGame]]],
      error: null,
      isConnected: false,
    });

    render(<LiveOddsPage />);
    expect(
      screen.getByText(/Real-time updates temporarily unavailable/i),
    ).toBeInTheDocument();
  });
});
