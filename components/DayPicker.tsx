import { Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export const DayPicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [dateClicked, setDateClicked] = useState(false);

    return <>
      
                  { !dateClicked ? 
                    <Text color={'blue.400'} fontWeight={'semibold'} onClick={() => setDateClicked(true)}>Choose Date</Text> :
                    <Box>
                      <DatePicker selected={startDate} onClickOutside={() => setDateClicked(false)} onChange={(date: Date) => setStartDate(date)} />
                      </Box>
                      }


        </>
  }
  