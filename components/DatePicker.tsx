import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { DATE_LINK_FORMAT } from "@/constants";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";
import Calendar from "./Calendar";
import "react-day-picker/style.css";
import { Button } from "./ui/button";

export default function DatePicker({ day }: { day: string }) {
  const pathname = usePathname();
  const [date, setDate] = useState<Date>(parseISO(day));
  const router = useRouter();

  useEffect(() => {
    setDate(parseISO(day));
  }, [day]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const currentDate = format(selectedDate, DATE_LINK_FORMAT);

    setDate(selectedDate);
    router.push(pathname + `?date=${currentDate}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="dark:bg-gray-700 dark:text-white bg-white text-black">
          <div className="flex gap-2">
            <CalendarDays width={20} />
            <span className="font-semibold">
              {date ? format(date, "PPP") : "Pick a date"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover">
        <Calendar selected={date} onSelect={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
}
