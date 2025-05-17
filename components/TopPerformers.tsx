import PerformerSection from "./PerformerSection";
import useLeaders from "@/hooks/useLeaders";

type TopPerformersProps = {
  pointLeaders: ReturnType<typeof useLeaders>["pointLeaders"];
  assistLeaders: ReturnType<typeof useLeaders>["assistLeaders"];
  reboundLeaders: ReturnType<typeof useLeaders>["reboundLeaders"];
  stealLeaders: ReturnType<typeof useLeaders>["stealLeaders"];
  blockLeaders: ReturnType<typeof useLeaders>["blockLeaders"];
  gameIdsLoading: boolean;
  useLeadersLoading: boolean;
  date: string | null | undefined;
};

export default function TopPerformers({
  pointLeaders,
  assistLeaders,
  reboundLeaders,
  stealLeaders,
  blockLeaders,
  gameIdsLoading,
  useLeadersLoading,
  date,
}: TopPerformersProps) {
  return (
    <>
      <PerformerSection
        leaders={pointLeaders}
        category={"points"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={assistLeaders}
        category={"assists"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={reboundLeaders}
        category={"reboundsTotal"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={stealLeaders}
        category={"steals"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={blockLeaders}
        category={"blocks"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
    </>
  );
}
