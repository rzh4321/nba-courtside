import { useState } from "react";
import { useLastPlayedGameDate } from "./useLastPlayedGameDate";
import format from "date-fns/format";
import { DATE_LINK_FORMAT } from "@/constants";
import { useSearchParams } from "next/navigation";
import parse from "date-fns/parse";

// gets the game date to render the top performers from that date
export default function useTopPerformersDate() {
  const {
    date: lastDate,
    dateLoading: isLoading,
    error,
  } = useLastPlayedGameDate();
  const searchParams = useSearchParams();

  let date: null | string | undefined = searchParams.get("date");
  if (date === null) {
    // get the last game date if user didnt ask for a specific date
    if (!isLoading && lastDate) {
      date = lastDate;
    } else {
      // lastDate not found
      date = undefined;
    }
  } else {
    // user asked for a specific date, get it from the url
    // convert it to format of mm-dd-yyyy
    date = format(parse(date, "yyyy-MM-dd", new Date()), "MM-dd-yyyy");
  }

  return { date, error };
}
