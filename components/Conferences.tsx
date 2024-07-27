"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import ConferenceButton from "./ConferenceButton";
import type { Conference } from "@/utils/mappers";
import { EAST_CONFERENCE, WEST_CONFERENCE, CONFERENCE_KEY } from "@/constants";
import StandingTable from "./StandingTable";

type SwitchConferenceProps = {
  east: Conference;
  west: Conference;
};

function Conferences({ east, west }: SwitchConferenceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [conference, setConference] = useState(EAST_CONFERENCE);

  const isEast = conference === EAST_CONFERENCE;
  const isWest = conference === WEST_CONFERENCE;

  const updateConference = (conference: string) => {
    setConference(conference);
  };

  return (
    <>
      <div className="flex gap-4">
        <ConferenceButton
          label={"East"}
          active={isEast}
          onClick={() => updateConference(EAST_CONFERENCE)}
        />
        <ConferenceButton
          label={"West"}
          active={isWest}
          onClick={() => updateConference(WEST_CONFERENCE)}
        />
      </div>
      {isEast && <StandingTable label="Eastern" conference={east} />}
      {isWest && <StandingTable label="Western" conference={west} />}
    </>
  );
}

export default Conferences;
