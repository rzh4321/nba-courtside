import { expect, test, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopPerformers } from "@/components/HomePage";

vi.mock("@/components/PerformerSection", () => ({
  default: ({ category }: any) => <div data-testid="section">{category}</div>,
}));

describe("TopPerformers component", () => {
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

  const defaultProps = {
    pointLeaders: mockLeaders,
    assistLeaders: mockLeaders,
    reboundLeaders: mockLeaders,
    stealLeaders: mockLeaders,
    blockLeaders: mockLeaders,
    date: "05-14-2025",
    gameIdsLoading: false,
    useLeadersLoading: false,
  };

  test("renders 5 Section components", () => {
    render(<TopPerformers {...defaultProps} />);
    const sections = screen.getAllByTestId("section");
    expect(sections).toHaveLength(5);
    expect(sections.map((el) => el.textContent)).toEqual([
      "points",
      "assists",
      "reboundsTotal",
      "steals",
      "blocks",
    ]);
  });

  test("passes loading=true when gameIdsLoading is true", () => {
    render(
      <TopPerformers
        {...defaultProps}
        gameIdsLoading={true}
        useLeadersLoading={false}
      />,
    );

    const sections = screen.getAllByTestId("section");
    expect(sections.map((el) => el.textContent)).toEqual([
      "points",
      "assists",
      "reboundsTotal",
      "steals",
      "blocks",
    ]);
  });

  test("passes loading=true when useLeadersLoading is true", () => {
    render(
      <TopPerformers
        {...defaultProps}
        gameIdsLoading={false}
        useLeadersLoading={true}
      />,
    );

    const sections = screen.getAllByTestId("section");
    expect(sections).toHaveLength(5);
  });

  test("passes loading=true when both loading flags are true", () => {
    render(
      <TopPerformers
        {...defaultProps}
        gameIdsLoading={true}
        useLeadersLoading={true}
      />,
    );

    const sections = screen.getAllByTestId("section");
    expect(sections).toHaveLength(5);
  });

  test("passes loading=false when both loading flags are false", () => {
    render(<TopPerformers {...defaultProps} />);
    const sections = screen.getAllByTestId("section");
    expect(sections).toHaveLength(5);
  });
});
