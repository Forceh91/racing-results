import { FilterOptionsState } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { ChangeEventHandler, HTMLAttributes, SyntheticEvent, useState } from "react";
import { RefCallBack } from "react-hook-form";

type Props = {
  defaultValue: any;
  options: any[];
  isLoading: boolean;
  label: string;
  isOptionEqualToValue?: (option: any) => boolean;
  getOptionLabel?: (option: any) => string;
  renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: any) => JSX.Element;
  onChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  textFieldOnChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  filterOptions?: (options: any[], state: FilterOptionsState<any>) => any[];
  ref: RefCallBack;
};

export const AutoCompleteWithAdd = ({
  defaultValue,
  options,
  isLoading,
  label,
  isOptionEqualToValue,
  getOptionLabel,
  renderOption,
  onChange,
  filterOptions,
  ref,
  textFieldOnChange,
}: Props) => (
  <Autocomplete
    options={options}
    isOptionEqualToValue={isOptionEqualToValue}
    getOptionLabel={getOptionLabel}
    renderOption={renderOption}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
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
        onChange={textFieldOnChange}
        required
      />
    )}
    onChange={onChange}
    filterOptions={filterOptions}
    loading={isLoading}
    defaultValue={defaultValue}
    freeSolo
  />
);
