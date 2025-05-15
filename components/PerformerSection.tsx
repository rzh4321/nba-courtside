import type { PlayerStatistics } from "@/types";
import { PerformerCard } from "./PerformerCard";
import startCase from "lodash/startCase";
import { isToday, parse, isFuture } from "date-fns";

import useLeaders from "@/hooks/useLeaders";
type SectionProps = {
  leaders: ReturnType<typeof useLeaders>["pointLeaders"];
  category: keyof PlayerStatistics;
  isLoading: boolean;
  date: string | null | undefined;
};

// display a category and its leaders
export default function PerformerSection({
  leaders,
  category,
  isLoading,
  date,
}: SectionProps) {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <h2 className="text-2xl text-gray-700 dark:text-gray-400 font-normal">
        {startCase(category).split(" ")[0]}
      </h2>
      <div className="w-full flex flex-wrap gap-8 justify-center sm:justify-start">
        {/* display leaders for this category */}
        {isLoading ? (
          <div
            data-testid="spinner"
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"
          />
        ) : leaders.length > 0 ? (
          leaders.map((leader) => (
            <PerformerCard
              key={`${leader.personId}-${category}`}
              player={leader}
              category={category}
            />
          ))
        ) : date && isFuture(parse(date, "MM-dd-yyyy", new Date())) ? (
          <div>
            Top performers will be displayed here after any games are played
          </div>
        ) : (
          <div>
            No games{" "}
            {date && isToday(parse(date, "MM-dd-yyyy", new Date()))
              ? "are"
              : "were"}{" "}
            scheduled for this date
          </div>
        )}
      </div>
    </div>
  );
}
