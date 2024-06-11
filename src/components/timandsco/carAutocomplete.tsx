import { Box, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useCarsSearchQuery } from "hooks";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Car } from "types";

type Props = { car?: Car; control: any; name: string };

export const CarAutoComplete = ({ car, control, name }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: results, ...driverSearchQuery } = useCarsSearchQuery(searchQuery);

  const isLoading = driverSearchQuery.isFetching;

  return (
    <Box sx={{ width: 250 }}>
      <Controller
        render={({ field: { value, onChange, ref } }) => (
          <Autocomplete
            options={(!!results?.cars.length ? results.cars : [car]) ?? []}
            isOptionEqualToValue={(option) => option?.uuid === value}
            getOptionLabel={(option) => (typeof option === "string" ? option : option?.name) ?? ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Car"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                ref={ref}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            )}
            onChange={(e, value) => {
              if (!value || typeof value === "string") onChange(value ?? "");
              else onChange(value.uuid);
            }}
            loading={isLoading}
            freeSolo
            defaultValue={car}
          />
        )}
        name={name}
        control={control}
      />
    </Box>
  );
};
