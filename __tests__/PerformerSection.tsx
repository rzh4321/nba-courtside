import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import PerformerSection from "@/components/PerformerSection";
import { format } from "date-fns";
import { vi } from "vitest";

// Mock PerformerCard
vi.mock("./PerformerCard", () => ({
  PerformerCard: ({ player }: any) => (
    <div>
      {player.firstName} {player.familyName}
    </div>
  ),
}));

describe("PerformerSection component", () => {
  const mockCategory = "points";
  const today = format(new Date(), "MM-dd-yyyy");
  const futureDate = format(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    "MM-dd-yyyy",
  );
  const pastDate = format(
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    "MM-dd-yyyy",
  );

  const mockLeaders = [
    {
      personId: 1,
      firstName: "Jalen",
      familyName: "Brunson",
      statistics: { points: 30 },
      team: "NYK",
    },
    {
      personId: 2,
      firstName: "Josh",
      familyName: "Hart",
      statistics: { points: 25 },
      team: "NYK",
    },
  ] as any;

  test("renders loading spinner when isLoading is true", () => {
    render(
      <PerformerSection
        category={mockCategory}
        leaders={[]}
        isLoading={true}
        date={today}
      />,
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders PerformerCard components for each leader", () => {
    render(
      <PerformerSection
        category={mockCategory}
        leaders={mockLeaders}
        isLoading={false}
        date={today}
      />,
    );

    expect(screen.getByText("Jalen Brunson")).toBeInTheDocument();
    expect(screen.getByText("Josh Hart")).toBeInTheDocument();
  });

  test("shows future message when no leaders and date is in the future", () => {
    render(
      <PerformerSection
        category={mockCategory}
        leaders={[]}
        isLoading={false}
        date={futureDate}
      />,
    );

    expect(
      screen.getByText(
        "Top performers will be displayed here after any games are played",
      ),
    ).toBeInTheDocument();
  });

  test("shows today message when no leaders and date is today", () => {
    render(
      <PerformerSection
        category={mockCategory}
        leaders={[]}
        isLoading={false}
        date={today}
      />,
    );

    expect(
      screen.getByText("No games are scheduled for this date"),
    ).toBeInTheDocument();
  });

  test("shows past date message when no leaders and date is in the past", () => {
    render(
      <PerformerSection
        category={mockCategory}
        leaders={[]}
        isLoading={false}
        date={pastDate}
      />,
    );

    expect(
      screen.getByText("No games were scheduled for this date"),
    ).toBeInTheDocument();
  });
});
