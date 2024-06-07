import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { LoadingBar, ErrorBar } from "components/alerts";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { useEventQuery } from "hooks";
import { sortAggregatedResults } from "lib/results";
import { useRouter } from "next/router";

const TimScoEvents = () => {
  const router = useRouter();
  const { data: event, ...eventQuery } = useEventQuery(router.query.uuid as string);

  const sortedAggregateResults = event?.aggregated_results.length && sortAggregatedResults(event.aggregated_results);

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

            {sortedAggregateResults && (
              <>
                <Stack spacing={1}>
                  <Typography variant="h2">Overall Results (After Stage {event.last_event_result_number})</Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

export default TimScoEvents;
