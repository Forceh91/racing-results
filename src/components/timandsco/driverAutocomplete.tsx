import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDriversSearchQuery } from "hooks/useDrivers";
import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Driver } from "types";

type Props = { driver?: Driver; control: any; name: string };

export const DriverAutoComplete = ({ driver, control, name }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: results, ...driverSearchQuery } = useDriversSearchQuery(searchQuery);

  const isLoading = driverSearchQuery.isFetching;

  return (
    <Box sx={{ width: 250 }}>
      <Controller
        render={({ field: { value, onChange, ref } }) => (
          <Autocomplete
            options={(!!results?.drivers.length ? results.drivers : [driver]) ?? []}
            isOptionEqualToValue={(option) => option?.uuid === value}
            getOptionLabel={(option) => (typeof option === "string" ? option : option?.name) ?? ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Driver"
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
            defaultValue={driver}
          />
        )}
        name={name}
        control={control}
      />
    </Box>
  );
};
