import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import OddsBox from "@/components/OddsBox";
import React from "react";
import { toast } from "sonner";

vi.mock("@/components/BetPlacedAlert", () => ({
  default: () => <div data-testid="bet-placed">BetPlacedAlert content</div>,
}));

const mockUseAuthReturn = {
  isAuthenticated: true,
  user: { balance: 100 },
  loading: false,
  subtractBalance: vi.fn(),
};

vi.mock("@/hooks/useAuth", () => ({
  default: () => mockUseAuthReturn,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ totalPayout: "20.00" }),
  }),
) as any;

describe("OddsBox", () => {
  beforeEach(() => {
    mockUseAuthReturn.user.balance = 100;
    mockUseAuthReturn.subtractBalance.mockReset();
  });

  const baseProps = {
    type: "OVER" as "OVER",
    odds: 100,
    bettingLine: 210.5,
    gameId: "123",
    gameDate: "2025-05-15",
    teams: { home: "Lakers", away: "Celtics" },
    gameEnded: false,
  };

  const trigger = <div data-testid="odds-trigger">Open Bet</div>;

  test("renders children (trigger) correctly", () => {
    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);
    expect(screen.getByTestId("odds-trigger")).toBeInTheDocument();
  });

  test("renders BetPlacedAlert after successful bet", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ totalPayout: "20.00" }),
      }),
    ) as any;

    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);
    fireEvent.click(screen.getByTestId("odds-trigger"));

    // Fill in wager input
    const input = screen.getByTestId("wager");
    fireEvent.change(input, { target: { value: "10" } });

    // Submit
    const button = screen.getByRole("button", {
      name: /Accept and place bet/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("bet-placed")).toBeInTheDocument();
    });
  });

  test("shows error toast if balance is too low", async () => {
    // Mock user with low balance
    mockUseAuthReturn.user.balance = 5; // change balance before render

    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);

    fireEvent.click(screen.getByTestId("odds-trigger"));

    const input = screen.getByTestId("wager");
    fireEvent.change(input, { target: { value: "10" } });

    const button = screen.getByRole("button", {
      name: /Accept and place bet/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Insufficient balance. Visit your profile to deposit more money.",
      );
    });
  });

  test("shows error if API fails", async () => {
    // Mock failed fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Something went wrong!" }),
      }),
    ) as any;

    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);
    fireEvent.click(screen.getByTestId("odds-trigger"));

    const input = screen.getByTestId("wager");
    fireEvent.change(input, { target: { value: "10" } });

    const button = screen.getByRole("button", {
      name: /Accept and place bet/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong!");
    });
  });

  test("opens bet dialog on click when valid", async () => {
    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);
    fireEvent.click(screen.getByTestId("odds-trigger"));
    await waitFor(() => {
      expect(screen.getByText(/Betslip/i)).toBeInTheDocument();
    });
  });

  test("disables form if odds are null", () => {
    render(
      <OddsBox {...baseProps} odds={null}>
        {trigger}
      </OddsBox>,
    );
    fireEvent.click(screen.getByTestId("odds-trigger"));
    expect(screen.queryByText(/Betslip/i)).not.toBeInTheDocument();
  });

  test("disables form if bettingLine is null and not moneyline", () => {
    render(
      <OddsBox {...baseProps} bettingLine={null}>
        {trigger}
      </OddsBox>,
    );
    fireEvent.click(screen.getByTestId("odds-trigger"));
    expect(screen.queryByText(/Betslip/i)).not.toBeInTheDocument();
  });

  test("disables form if gameEnded is true", () => {
    render(
      <OddsBox {...baseProps} gameEnded={true}>
        {trigger}
      </OddsBox>,
    );
    fireEvent.click(screen.getByTestId("odds-trigger"));
    expect(screen.queryByText(/Betslip/i)).not.toBeInTheDocument();
  });

  test("shows error toast if game has ended after dialog has already opened", async () => {
    // mock fetch to return gameStatus ENDED
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ gameStatus: 3 }),
      }),
    ) as any;

    render(<OddsBox {...baseProps}>{trigger}</OddsBox>);
    fireEvent.click(screen.getByTestId("odds-trigger"));

    await waitFor(() => {
      expect(screen.getByText(/Betslip/i)).toBeInTheDocument();
    });

    const input = screen.getByTestId("wager");
    fireEvent.change(input, { target: { value: "10" } });

    const button = screen.getByRole("button", {
      name: /Accept and place bet/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("This game has ended.");
    });
  });
});
