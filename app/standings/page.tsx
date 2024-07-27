import Conferences from "@/components/Conferences";
import { REGULAR_MONTH_END } from "@/constants";
import { API } from "@/constants";
import { conferenceExtractor } from "@/utils/mappers";
import { addYears, getMonth, getYear } from "date-fns";

function getLeagueYear(date: Date) {
  return getMonth(date) > REGULAR_MONTH_END
    ? getYear(date)
    : getYear(addYears(date, -1));
}

async function getData() {
  const year = getLeagueYear(new Date());
  const nextYear = (year + 1) % 100;
  const season = `${year}-${nextYear}`;

  const res = await fetch(
    `${API.BASE_URL}/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=${season}&SeasonType=Regular%20Season&Section=overall`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  const data = await res.json();

  return {
    east: conferenceExtractor(data.resultSets[0].rowSet, true),
    west: conferenceExtractor(data.resultSets[0].rowSet, false),
  };
}

export default async function Page() {
  const { east, west } = await getData();

  return <Conferences east={east} west={west} />;
}
