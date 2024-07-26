import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    HStack,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { format, parseISO } from "date-fns";
  import { useRouter } from 'next/navigation';
  import { DATE_LINK_FORMAT } from '@/constants';
  import { usePathname } from 'next/navigation';
  import { CalendarDays } from 'lucide-react';
  import Calendar from './Calendar';
  import "react-day-picker/style.css";


  export default function DatePicker({ day } : {day : string}) {
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
    <Button>
        <HStack gap={2}>
            <CalendarDays width={20} />
            <span>{date ? format(date, "PPP") : 'Pick a date'}</span>
        </HStack>
    </Button>
  </PopoverTrigger>
  <PopoverContent className='popover'>
    {/* <PopoverArrow />
    <PopoverCloseButton />
    <PopoverHeader>Confirmation!</PopoverHeader>
    <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody> */}
    <Calendar
          selected={date}
          onSelect={handleDateChange}
        />
  </PopoverContent>
</Popover>
    )
  }