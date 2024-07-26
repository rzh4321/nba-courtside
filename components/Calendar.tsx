import { isToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarProps = {
    selected: Date;
    onSelect: (selectedDate: Date | undefined) => void;
}

function Calendar({ selected, onSelect }: CalendarProps) {
//   const isTodaySelected = !(
//     isToday(props.selected as string | Date) && Boolean(props.selected)
//   );

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}

    //   components={{
    //     IconLeft: () => <ChevronLeft />,
    //     IconRight: () => <ChevronRight />,
    //   }}

    />
  );
}

export default Calendar;
