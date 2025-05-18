import { render, screen } from "@testing-library/react";
import LiveGameCard from "@/components/LiveGameCard";
import { describe, test, vi, expect } from "vitest";
import { GAME_STATUS } from "@/constants";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("date=2025-05-18"),
}));

vi.mock("@/utils/getTeamNames", () => ({
  fullNbaTeams: {
    Knicks: "New York Knicks",
    Nets: "Brooklyn Nets",
  },
}));

// need this to be its own variable since we gonna test it
const { setGameIdMock } = vi.hoisted(() => {
  return {
    setGameIdMock: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("@/bettingService", () => {
  return {
    bettingService: {
      setGameId: setGameIdMock,
    },
  };
});

describe("LiveGameCard", () => {
  const mockGame = {
    gameId: "12345",
    gameStatus: GAME_STATUS.IN_PROGRESS,
    gameStatusText: "Q2",
    period: 2,
    gameClock: "PT2M30S",
    gameTimeUTC: new Date(),
    homeTeam: {
      teamId: 1,
      teamName: "Knicks",
      teamTricode: "NYK",
      wins: 20,
      losses: 10,
      score: 45,
    },
    awayTeam: {
      teamId: 2,
      teamName: "Nets",
      teamTricode: "BKN",
      wins: 19,
      losses: 11,
      score: 52,
    },
  };

  test("renders team names and scores", () => {
    render(<LiveGameCard game={mockGame} gameDate="2025-05-18" />);
    expect(screen.getAllByText(/NYK - 45/i)).toHaveLength(2);
    expect(screen.getAllByText(/BKN - 52/i)).toHaveLength(2);
  });

  test("adds correct link with gameId and date", () => {
    render(<LiveGameCard game={mockGame} gameDate="2025-05-18" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/boxscore/12345?date=2025-05-18");
  });

  test("calls bettingService.setGameId with correct args", () => {
    render(<LiveGameCard game={mockGame} gameDate="2025-05-18" />);
    expect(setGameIdMock).toHaveBeenCalledWith(
      "New York Knicks",
      "Brooklyn Nets",
      "2025-05-18",
      "12345",
    );
  });

  test("displays converted gameClock", () => {
    render(<LiveGameCard game={mockGame} gameDate="2025-05-18" />);
    expect(screen.getAllByText("Q2 2:30")).toHaveLength(2); // Desktop + Mobile
  });

  test("shows Halftime if period 2 and gameClock is 0:00", () => {
    const halftimeGame = {
      ...mockGame,
      gameClock: "0:00",
    };
    render(<LiveGameCard game={halftimeGame} gameDate="2025-05-18" />);
    expect(screen.getAllByText("Halftime")).toHaveLength(2);
  });

  test("shows End Q if not halftime and gameClock is 0:00", () => {
    const endQ3 = {
      ...mockGame,
      period: 3,
      gameClock: "0:00",
    };
    render(<LiveGameCard game={endQ3} gameDate="2025-05-18" />);
    expect(screen.getAllByText("End Q3")).toHaveLength(2);
  });

  test("bolds the leading team's score", () => {
    render(<LiveGameCard game={mockGame} gameDate="2025-05-18" />);
    const away = screen.getAllByText(/BKN - 52/)[0];
    const home = screen.getAllByText(/NYK - 45/)[0];

    expect(away.className).toMatch(/text-lg/);
    expect(home.className).not.toMatch(/text-lg/);
  });

  test("uses gameStatusText if it includes OT", () => {
    const otGame = {
      ...mockGame,
      gameStatusText: "2OT",
    };
    render(<LiveGameCard game={otGame} gameDate="2025-05-18" />);
    expect(screen.getAllByText("2OT")).toHaveLength(2);
  });

  test("uses gameStatusText if it includes 'Overtime'", () => {
    const overtimeGame = {
      ...mockGame,
      gameStatusText: "Overtime",
    };
    render(<LiveGameCard game={overtimeGame} gameDate="2025-05-18" />);
    expect(screen.getAllByText("Overtime")).toHaveLength(2);
  });
});
