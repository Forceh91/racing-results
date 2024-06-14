import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingBar } from "components/alerts";
import { useEventResultQuery } from "hooks";
import axios from "lib/axios";
import { formatRaceTime } from "lib/time";
import queryKeys from "queryKeys";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { TIMSCOStageResults, stageResultsSchema } from "schemas";
import { CarAutoComplete } from "./carAutocomplete";
import { DriverAutoComplete } from "./driverAutocomplete";

type Props = {
  stageUUID: string;
};

export const TIMSCOStageResultForm = ({ stageUUID }: Props) => {
  const queryClient = useQueryClient();
  const { data: results, ...stageResultsQuery } = useEventResultQuery(stageUUID);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<TIMSCOStageResults>({
    resolver: zodResolver(stageResultsSchema),
    mode: "onBlur",
    defaultValues: { stageUUID },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results", // unique name for your Field Array
  });

  const watch = useWatch({ control });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));
  const mutation = useMutation({
    mutationFn: (payload: TIMSCOStageResults) =>
      axios.post<TIMSCOStageResults>(`/timandsco/events/${results?.event.uuid}/results`, payload),
    onSuccess: () => queryClient.invalidateQueries({ ...queryKeys.events.results(stageUUID) }),
  });

  // once the results are loaded we can put them into the form
  useEffect(() => {
    if (!stageResultsQuery.isSuccess || !results || !results.results?.length) return;

    setValue(
      "results",
      results.results.map((result) => ({
        driverUUID: result.driver.uuid,
        teamUUID: result.team?.uuid ?? null,
        carUUID: result.car?.uuid,
        finished: result.finished,
        time: formatRaceTime(result.time),
      }))
    );
  }, [results, setValue, stageResultsQuery.isSuccess, stageUUID]);

  const addNewEntry = () => append({ driverUUID: "", teamUUID: null, carUUID: "", finished: true, time: "" });

  return (
    <Grid container>
      <Grid item xs={12}>
        <LoadingBar shouldShow={stageResultsQuery.isLoading} text={"Fetching stage results..."} />

        {results && (
          <Stack spacing={2} mb={2}>
            <Typography variant="h3">Stage {results.event_result_number} Results</Typography>

            <Stack spacing={2}>
              <form onSubmit={onSubmit}>
                {fields.map((item, index) => (
                  <Stack direction="row" spacing={2} mb={2} key={item.id}>
                    <DriverAutoComplete
                      driver={results.results.find((entry) => entry.driver.uuid === item.driverUUID)?.driver}
                      control={control}
                      name={`results.${index}.driverUUID` as const}
                    />

                    {/* <TextField {...register(`results.${index}.teamUUID` as const)} label="Team" /> */}

                    <CarAutoComplete
                      car={results.results.find((entry) => entry.car.uuid === item.carUUID)?.car}
                      control={control}
                      name={`results.${index}.carUUID` as const}
                    />

                    <Controller
                      name={`results.${index}.finished` as const}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                              checked={value}
                              onChange={(e, checked) => {
                                if (!checked) setValue(`results.${index}.time`, "");
                                onChange(e, checked);
                              }}
                            />
                          }
                          label="Finished?"
                        />
                      )}
                    />
                    {watch.results?.[index].finished && (
                      <TextField
                        {...register(`results.${index}.time` as const)}
                        required={watch.results[index].finished}
                        label="Stage Time"
                        inputProps={{
                          pattern: watch.results[index].finished
                            ? "^((d+):)?([0-5][0-9]):([0-5][0-9]).([0-9][0-9][0-9])$"
                            : "",
                        }}
                      />
                    )}
                    <Button variant="text" color="error" onClick={() => remove(index)} title="Delete Entry">
                      <Typography>X</Typography>
                    </Button>
                  </Stack>
                ))}

                <Button type="button" variant="contained" onClick={addNewEntry} sx={{ mr: 2 }} size="small">
                  <Typography>Add new entry</Typography>
                </Button>

                <Button type="submit" variant="contained" color="success">
                  <Typography>Save</Typography>
                </Button>

                <DevTool control={control} />
              </form>
            </Stack>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};
