import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useDriversSearchQuery } from "hooks/useDrivers";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Driver, DriverSearch, DriverSearchItem } from "types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "lib/axios";
import { DRIVER_MIN_SEARCH_LENGTH } from "consts";
import queryKeys from "queryKeys";

type Props = { driver?: Driver; control: any; name: string };

const filter = createFilterOptions<Driver | DriverSearchItem | undefined>();

export const DriverAutoComplete = ({ driver, control, name }: Props) => {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const { data: results, ...driverSearchQuery } = useDriversSearchQuery(searchQuery);

  const createDriverMutation = useMutation({
    mutationFn: async () => axios.post<DriverSearchItem>(`/timandsco/drivers`, { name: searchQuery }),
    onSuccess: (data) => {
      queryClient.setQueryData<DriverSearch>(
        queryKeys.drivers.search(searchQuery).queryKey,
        (oldData) =>
          oldData && {
            drivers: [data.data, ...oldData.drivers],
          }
      );
    },
  });
  const isLoading = driverSearchQuery.isFetching || createDriverMutation.isPending;

  return (
    <Box sx={{ width: 250 }}>
      <Controller
        render={({ field: { value, onChange, ref } }) => (
          <Autocomplete
            options={
              searchQuery?.length >= DRIVER_MIN_SEARCH_LENGTH && !!results?.drivers?.length ? results.drivers : [driver]
            }
            isOptionEqualToValue={(option) => option?.uuid === value}
            getOptionLabel={(option) => {
              // use hit enter on an option
              if (!option || typeof option === "string") return option ?? "";

              // user did the "add xxx" option
              if (option.inputValue) return option.inputValue;

              // normal option
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option?.name ?? ""}</li>}
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
            onChange={async (e, value) => {
              if (!value || typeof value === "string") onChange(value ?? "");
              else {
                if (!value?.uuid.length) {
                  const { data } = await createDriverMutation.mutateAsync();
                  if (data) onChange(data.uuid);
                } else onChange(value.uuid);
              }
            }}
            filterOptions={(filterOptions, params) => {
              const filtered = filter(filterOptions, params);
              const { inputValue } = params;
              const existing = filterOptions.some((driver) => driver?.name.toLowerCase() === inputValue.toLowerCase());
              if (inputValue?.length && !existing) filtered.push({ inputValue, uuid: "", name: `+ Add ${inputValue}` });

              return filtered;
            }}
            loading={isLoading}
            defaultValue={{ uuid: driver?.uuid ?? "", name: driver?.name ?? "" }}
            freeSolo
          />
        )}
        name={name}
        control={control}
      />
    </Box>
  );
};
