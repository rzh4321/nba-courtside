"use client";

import { format, parse, isToday } from "date-fns";
import { useSchedule } from "@/hooks/useSchedule";
import { LiveGameCard } from "./LiveGameCard";
import { useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import getDays from "@/utils/getDays";
import { DATE_LINK_FORMAT } from "@/constants";
import Link from "next/link";
import DatePicker from "./DatePicker";
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react";

export const ScheduleBar = () => {
  const [hidden, setHidden] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const date = searchParams.get("date");
  const today = format(new Date(), DATE_LINK_FORMAT);
  const dateWithDashes = date ? date : new Date().toLocaleDateString("en-CA");
  const { day, prevDay, nextDay } = getDays(dateWithDashes);
  const { data, isLoading, error } = useSchedule(dateWithDashes);

  const prevLink = pathname + (prevDay === today ? "?" : `?date=${prevDay}`);
  const nextLink = pathname + (nextDay === today ? "?" : `?date=${nextDay}`);

  return (
    <div className="relative">
      <div
        className={`w-full bg-blue-500 dark:bg-gray-900 ${hidden ? "hidden" : ""}`}
        style={{ height: isLoading ? "157px" : "auto" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full p-4 flex flex-col gap-4">
            <div className="w-full flex">
              {data && (
                <p className="text-white font-semibold">
                  Games for{" "}
                  {format(
                    parse(dateWithDashes, "yyyy-MM-dd", new Date()),
                    "EEEE, MMMM do",
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start">
              <Link href={prevLink}>
                <ArrowLeft className="text-white" />
              </Link>
              <DatePicker day={dateWithDashes} />
              <Link href={nextLink}>
                <ArrowRight className="text-white" />
              </Link>
            </div>

            <div className="w-full overflow-auto scrollable">
              {isLoading || data == undefined ? (
                <p>Loading</p>
              ) : error ? (
                <p>There was an error when fetching today{"'"}s schedule</p>
              ) : data.length > 0 ? (
                <div className="flex gap-8">
                  {data.map((game) => (
                    <LiveGameCard key={game.gameId} game={game} />
                  ))}
                </div>
              ) : (
                <div className="w-full text-gray-500 font-semibold">
                  <p>
                    No games scheduled for{" "}
                    {isToday(parse(dateWithDashes, "yyyy-MM-dd", new Date()))
                      ? "today"
                      : "this date"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => setHidden((prev) => !prev)}
        className="absolute cursor-pointer flex items-center justify-center -bottom-2 shadow-xl left-1/2 -translate-x-1/2 bg-white dark:bg-black rounded-full w-[22px] h-[22px]"
      >
        {!hidden ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
  );
};
