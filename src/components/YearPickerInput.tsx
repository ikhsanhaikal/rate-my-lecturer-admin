import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { useController } from "react-hook-form";
import { DateValidationError } from "@mui/x-date-pickers/models";

export default function YearPickerInput() {
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
  } = useController({
    name: "year",
    defaultValue: dayjs(),
    rules: { required: true },
  });

  return (
    <DatePicker
      {...field}
      value={dayjs(field.value)}
      label="Year"
      views={["year"]}
      slotProps={{
        textField: {
          required: true,
        },
      }}
    />
  );
}
