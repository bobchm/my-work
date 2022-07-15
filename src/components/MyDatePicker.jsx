import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {encodeDate, addDays, getToday} from "../dates";

export default function MyDatePicker(props) {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
          label={props.label}
          inputFormat="MM/dd/yyyy"
          value={props.date}
          sx={{ width: 200 }}
          onChange={function(newValue) {
                    setValue(newValue);
                    props.callback(newValue);
                  }}
          renderInput={(params) => <TextField {...params} />}
        />
    </LocalizationProvider>
  );
}