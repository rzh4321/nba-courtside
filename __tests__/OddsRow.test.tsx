import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import OddsRow from "@/components/OddsRow";
import React from "react";

vi.mock("@/components/OddsBox", () => ({
  default: ({ type, odds }: any) => (
    <>
      <div data-testid="oddsbox">{type}</div>
      <div>
        <span>{odds === null ? "-" : odds}</span>
      </div>
    </>
  ),
}));

const mockGame = {
  gameId: "123",
  gameDate: "2025-05-15",
  hasEnded: false,
  awayTeam: "Brooklyn Nets",
  homeTeam: "New York Knicks",
  awaySpreadOdds: 110,
  homeSpreadOdds: -110,
  awayMoneyline: 120,
  homeMoneyline: -130,
  overOdds: 105,
  overUnder: 215.5,
  openingOverUnder: 213,
  homeSpread: -4.5,
  openingHomeSpread: -3.5,
} as any;

describe("OddsRow component", () => {
  test("passes correct bet types to OddsBox when isAwayTeam = true", () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    const types = screen.getAllByTestId("oddsbox").map((el) => el.textContent);
    expect(types).toEqual(["SPREAD_AWAY", "OVER", "MONEYLINE_AWAY"]);
  });

  test("passes correct bet types to OddsBox when isAwayTeam = false", () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={false} gameId="123" />,
    );
    const types = screen.getAllByTestId("oddsbox").map((el) => el.textContent);
    expect(types).toEqual(["SPREAD_HOME", "UNDER", "MONEYLINE_HOME"]);
  });

  test("renders 3 OddsBox components when game has not ended", () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getAllByTestId("oddsbox")).toHaveLength(3);
  });

  test("renders 2 OddsBox components when game has ended", () => {
    const endedGame = { ...mockGame, hasEnded: true };
    render(
      <OddsRow gameBettingInfo={endedGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getAllByTestId("oddsbox")).toHaveLength(2);
  });

  test('shows "-" in Spread box if spread odds is null', () => {
    const game = { ...mockGame, awaySpreadOdds: null };
    render(<OddsRow gameBettingInfo={game} isAwayTeam={true} gameId="123" />);
    expect(screen.getAllByText("-")).toHaveLength(1);
  });

  test('shows "-" in Total box if overOdds is null', () => {
    const game = { ...mockGame, overOdds: null };
    render(<OddsRow gameBettingInfo={game} isAwayTeam={true} gameId="123" />);
    expect(screen.getAllByText("-")).toHaveLength(1);
  });

  test("shows invisible box if isAwayTeam = true", () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getByTestId("invisible")).toBeInTheDocument();
  });

  test('shows "Spread" header if isAwayTeam = true', () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getAllByText("Spread")).toHaveLength(1);
  });

  test('shows "Total" header if isAwayTeam = true', () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getAllByText("Total")).toHaveLength(1);
  });

  test('shows "Money" header if isAwayTeam = true', () => {
    render(
      <OddsRow gameBettingInfo={mockGame} isAwayTeam={true} gameId="123" />,
    );
    expect(screen.getAllByText("Money")).toHaveLength(1);
  });
});
