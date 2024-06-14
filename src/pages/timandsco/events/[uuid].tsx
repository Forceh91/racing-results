import { MenuItem, Select, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ErrorBar, LoadingBar } from "components/alerts";
import { TIMSCOStageResultForm } from "components/timandsco";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { useEventQuery } from "hooks";
import { sortAggregatedResults } from "lib/results";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TimScoEvents = () => {
  const router = useRouter();
  const { data: event, ...eventQuery } = useEventQuery(router.query.uuid as string);
  const [selectedStageUUID, setSelectedStageUUID] = useState("");

  const sortedAggregateResults = event?.aggregated_results.length && sortAggregatedResults(event.aggregated_results);

  useEffect(() => {
    if (eventQuery.isSuccess && event && event.itinerary.length) setSelectedStageUUID(event.itinerary[0].uuid);
  }, [eventQuery.isSuccess, event]);

  return (
    <Grid container rowSpacing={3}>
      <LoadingBar
        shouldShow={eventQuery.isLoading || typeof router.query.uuid !== "string"}
        text={"Fetching event info..."}
      />

      <ErrorBar shouldShow={!eventQuery.isLoading && !!eventQuery.error} text="Unable to fetch event data" />

      {eventQuery.isSuccess && event && (
        <Grid item xs={12}>
          <Stack spacing={4}>
            <Typography variant="h2">
              <TextWithNationalityFlagSuffix nationality={event.country ?? ""} text={event.name} />
            </Typography>

            <Select value={selectedStageUUID} onChange={(e) => setSelectedStageUUID(e.target.value)}>
              {event.itinerary.length > 0 &&
                event.itinerary.map((itineraryEntry) => (
                  <MenuItem key={itineraryEntry.uuid} value={itineraryEntry.uuid}>
                    Stage {itineraryEntry.event_result_number}
                  </MenuItem>
                ))}
            </Select>

            {!!selectedStageUUID.length && (
              <TIMSCOStageResultForm key={selectedStageUUID} stageUUID={selectedStageUUID} />
            )}

            {/* {sortedAggregateResults && (
              <>
                <Stack spacing={1}>
                  <Typography variant="h2">Overall Results (After Stage {event.last_event_result_number})</Typography>
                </Stack>
              </>
            )} */}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

export default TimScoEvents;
