import { Box } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CAR_MIN_SEARCH_LENGTH } from "consts";
import { useCarsSearchQuery } from "hooks";
import axios from "lib/axios";
import queryKeys from "queryKeys";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Car, CarSearch, CarSearchItem } from "types";
import { AutoCompleteWithAdd } from "./autocompletewithadd";

const filter = createFilterOptions<Car | CarSearchItem | undefined>();

type Props = { car?: Car; control: any; name: string };

export const CarAutoComplete = ({ car, control, name }: Props) => {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const { data: results, ...carSearchQuery } = useCarsSearchQuery(searchQuery);

  const createCarMutation = useMutation({
    mutationFn: async () => axios.post<CarSearchItem>(`/timandsco/cars`, { name: searchQuery }),
    onSuccess: (data) => {
      queryClient.setQueryData<CarSearch>(
        queryKeys.cars.search(searchQuery).queryKey,
        (oldData) =>
          oldData && {
            cars: [data.data, ...oldData.cars],
          }
      );
    },
  });
  const isLoading = carSearchQuery.isFetching || createCarMutation.isPending;

  return (
    <Box sx={{ width: 250 }}>
      <Controller
        render={({ field: { value, onChange, ref } }) => (
          <AutoCompleteWithAdd
            options={searchQuery?.length >= CAR_MIN_SEARCH_LENGTH && !!results?.cars?.length ? results.cars : [car]}
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
            onChange={async (e, value) => {
              if (!value || typeof value === "string") onChange(value ?? "");
              else {
                if (!value?.uuid.length) {
                  const { data } = await createCarMutation.mutateAsync();
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
            textFieldOnChange={(e) => setSearchQuery(e.target.value)}
            isLoading={isLoading}
            defaultValue={car}
            label="Car"
            ref={ref}
          />
        )}
        name={name}
        control={control}
      />
    </Box>
  );
};
