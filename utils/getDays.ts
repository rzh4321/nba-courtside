import {
    addDays,
    addYears,
    format,
    getMonth,
    getYear,
    parseISO,
    subDays,
  } from "date-fns";

const DATE_LINK_FORMAT = "yyyy-MM-dd";

export default function getDays(date: string | null) {
    const now = new Date().toLocaleDateString('en-CA');
    const day = parseISO(date ?? now);
  
    return {
      day: format(day, DATE_LINK_FORMAT),
      prevDay: format(subDays(day, 1), DATE_LINK_FORMAT),
      nextDay: format(addDays(day, 1), DATE_LINK_FORMAT),
    };
  }