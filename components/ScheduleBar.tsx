"use client";

import { format, parse, isToday } from "date-fns";
import { useSchedule } from "@/hooks/useSchedule";
import LiveGameCard from "./LiveGameCard";
import { useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect, ReactNode } from "react";
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
  // dateWithDashes is either specifically requested, or todays date
  const dateWithDashes = date ? date : today;
  // get the schedule of requested date, OR today's games (will still show yesterdays games if its like 2 AM)
  const { data, isLoading, error } = useSchedule(date && date);
  const calendarDate =
    data && data.length > 0
      ? new Date(data[0].gameTimeUTC).toLocaleDateString("en-CA", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      : dateWithDashes;
  const { day, prevDay, nextDay } = getDays(calendarDate);

  const prevLink =
    pathname + (prevDay === today ? `?date=${today}` : `?date=${prevDay}`);
  const nextLink =
    pathname + (nextDay === today ? `?date=${today}` : `?date=${nextDay}`);

  const loadingSkeleton = Array.from({ length: 10 }).map((num, i) => (
    <div key={i} className="">
      <div className="w-[135px] h-[100px] bg-white dark:bg-gray-700 rounded-md"></div>
    </div>
  ));

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
                    parse(calendarDate, "yyyy-MM-dd", new Date()),
                    "EEEE, MMMM do",
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start">
              <Link href={prevLink}>
                <ArrowLeft className="text-white" />
              </Link>
              <DatePicker day={calendarDate} />
              <Link href={nextLink}>
                <ArrowRight className="text-white" />
              </Link>
            </div>
            <div className="w-full overflow-auto scrollable">
              {isLoading || data == undefined ? (
                <div className="flex gap-8 animate-pulse">
                  {loadingSkeleton}
                </div>
              ) : error ? (
                <p>There was an error when fetching today{"'"}s schedule</p>
              ) : data.length > 0 ? (
                <CustomScrollbarContainer>
                  {data.map((game) => (
                    <LiveGameCard
                      key={game.gameId}
                      game={game}
                      gameDate={calendarDate}
                    />
                  ))}
                </CustomScrollbarContainer>
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

type Props = {
  children: ReactNode;
};

function CustomScrollbarContainer({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateThumb = () => {
    const scroll = scrollRef.current;
    if (!scroll || !thumbRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scroll;
    const ratio = scrollLeft / (scrollWidth - clientWidth);
    const maxThumbPos = clientWidth - 24;
    setThumbLeft(ratio * maxThumbPos);
  };

  const handleMouseMove = (clientX: number) => {
    const scroll = scrollRef.current;
    if (!scroll || !isDragging) return;

    const { left } = scroll.getBoundingClientRect();
    const x = clientX - left;
    const ratio = Math.max(
      0,
      Math.min(1, (x - 12) / (scroll.clientWidth - 24)),
    );
    scroll.scrollLeft = ratio * (scroll.scrollWidth - scroll.clientWidth);
  };

  // Mouse events
  const handleMouseMoveEvent = (e: MouseEvent) => {
    handleMouseMove(e.clientX);
  };

  // Touch events
  const handleTouchMoveEvent = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMouseMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    scroll.addEventListener("scroll", updateThumb);
    window.addEventListener("mousemove", handleMouseMoveEvent);
    window.addEventListener("mouseup", () => setIsDragging(false));

    window.addEventListener("touchmove", handleTouchMoveEvent);
    window.addEventListener("touchend", () => setIsDragging(false));

    updateThumb();

    return () => {
      scroll.removeEventListener("scroll", updateThumb);
      window.removeEventListener("mousemove", handleMouseMoveEvent);
      window.removeEventListener("mouseup", () => setIsDragging(false));

      window.removeEventListener("touchmove", handleTouchMoveEvent);
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-8 py-4 px-2">{children}</div>
      </div>

      <div className="relative w-full h-6 mt-1">
        <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gray-300 rounded-full transform -translate-y-1/2" />
        <div
          ref={thumbRef}
          className="absolute top-1/2 w-6 h-6 rounded-full shadow-md cursor-pointer transform -translate-y-1/2 transition-colors duration-200 bg-no-repeat bg-center bg-contain hover:bg-blue-600"
          style={{
            left: `${thumbLeft}px`,
            backgroundImage: "url('/icon.ico')",
          }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        />
      </div>
    </div>
  );
}
