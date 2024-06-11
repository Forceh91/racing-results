import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEventResultQuery } from "hooks";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TIMSCOStageResults, stageResultsSchema } from "schemas";
import { formatRaceTime } from "lib/time";
import { useMutation } from "@tanstack/react-query";
import axios from "lib/axios";
import { IconButton } from "@mui/material";

type Props = {
  stageUUID: string;
};

export const TIMSCOStageResultForm = ({ stageUUID }: Props) => {
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

  const onSubmit = handleSubmit((data) => mutation.mutate(data));
  const mutation = useMutation({
    mutationFn: (payload: TIMSCOStageResults) =>
      axios.post<TIMSCOStageResults>(`/timandsco/events/${results?.event.uuid}/results`, payload),
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
        {results && (
          <Stack spacing={2} mb={2}>
            <Typography variant="h3">Stage {results.event_result_number} Results</Typography>

            <Stack spacing={2}>
              <form onSubmit={onSubmit}>
                {fields.map((item, index) => (
                  <Stack direction="row" spacing={2} mb={2} key={item.id}>
                    <TextField {...register(`results.${index}.driverUUID` as const)} required label="Driver" />
                    <TextField {...register(`results.${index}.teamUUID` as const)} label="Team" />
                    <TextField {...register(`results.${index}.carUUID` as const)} required label="Car" />
                    <Controller
                      name={`results.${index}.finished` as const}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                              checked={value}
                              onChange={onChange}
                            />
                          }
                          label="Finished?"
                        />
                      )}
                    />
                    <TextField
                      {...register(`results.${index}.time` as const)}
                      required
                      label="Stage Time"
                      inputProps={{ pattern: "^((d+):)?([0-5][0-9]):([0-5][0-9]).([0-9][0-9][0-9])$" }}
                    />
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
              </form>
            </Stack>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};
