import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFTextField({...props}) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field, fieldState: { error } }) => (
          <TextField {...field} fullWidth error={!!error} helperText={error?.message} {...props} />
        )}
      />
    );
  }