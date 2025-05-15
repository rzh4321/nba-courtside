import { expect, test, describe } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PerformerCard } from "@/components/PerformerCard";

describe("PerformerCard", () => {
  const mockPlayer = {
    personId: "123",
    firstName: "Jimmy",
    familyName: "Butler",
    team: "GSW",
    statistics: {
      points: 35,
    },
  } as any;

  test("renders player name and stats correctly", () => {
    render(<PerformerCard player={mockPlayer} category="points" />);
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("PTS")).toBeInTheDocument();
    expect(screen.getByText("Jimmy Butler")).toBeInTheDocument();
  });

  test("falls back to default image if player image fails to load", () => {
    render(<PerformerCard player={mockPlayer} category="points" />);
    const image = screen.getByRole("img");

    // simulate image error
    fireEvent.error(image);

    expect(image.getAttribute("src")).toContain(
      encodeURIComponent(
        "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png",
      ),
    );
  });

  test("truncates long family names", () => {
    const longNamePlayer = { ...mockPlayer, familyName: "Antetokounmpo" };
    render(<PerformerCard player={longNamePlayer} category="points" />);
    expect(screen.getByText("Jimmy A.")).toBeInTheDocument();
  });
});
