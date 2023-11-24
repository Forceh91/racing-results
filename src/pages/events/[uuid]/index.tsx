import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEvent } from "hooks/useEvents";
import { sortAggregatedResults } from "lib/results";
import { useRouter } from "next/router";
import { AggregateResultsTable } from "components/results";
import { EventResultsTable } from "components/events";
import { EventHeader } from "components/events";

export default function EventInfo() {
  const router = useRouter();
  const { data: event, error, isLoading, isSuccess } = useEvent(router.query.uuid as string);

  if (isLoading || !router.query.uuid)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="info">
            Fetching event info...
          </Alert>
        </Grid>
      </Grid>
    );

  if (error || !isSuccess)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="error">
            Unable to fetch event data
          </Alert>
        </Grid>
      </Grid>
    );

  const sortedAggregateResults = event.aggregated_results.length && sortAggregatedResults(event.aggregated_results);
  const latestEventResult = (event.results && event.results[event.event_result_number - 1]) ?? false;

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <EventHeader
          event={event}
          hasAggregatedResults={event.aggregated_results.length > 0}
          latestResultUUID={latestEventResult?.uuid}
        />

        {/* if we've got aggregated results we should show them as priority rather than a list of results to click into */}
        {sortedAggregateResults ? (
          <>
            <Box sx={{ my: 1 }}>
              <Typography variant="h3" sx={{ marginTop: 2 }}>
                Overall Standings (After Stage {event.event_result_number})
              </Typography>
            </Box>

            <AggregateResultsTable results={sortedAggregateResults} retirements={event.retirements} />
          </>
        ) : (
          <EventResultsTable eventResults={event.results} eventUUID={event.uuid} />
        )}
      </Grid>
    </Grid>
  );
}
