import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { EventHeader, ItineraryTable } from "components/events";
import { AggregateResultsTable } from "components/results";
import { useEventQuery } from "hooks/useEvents";
import { sortAggregatedResults } from "lib/results";
import { useRouter } from "next/router";

export default function EventInfo() {
  const router = useRouter();
  const { data: event, error, isLoading, isSuccess } = useEventQuery(router.query.uuid as string);

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

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <EventHeader
          event={event}
          hasAggregatedResults={event.aggregated_results.length > 0}
          latestResultUUID={event.last_result_uuid}
        />

        {/* if we've got aggregated results we should show them as priority rather than a list of results to click into */}
        {sortedAggregateResults ? (
          <>
            <Box sx={{ my: 1 }}>
              <Typography variant="h3" sx={{ marginTop: 2 }}>
                Overall Results {event.itinerary?.length > 0 && <>(After Stage {event.last_event_result_number})</>}
              </Typography>
            </Box>

            <AggregateResultsTable results={sortedAggregateResults} retirements={event.retirements} />
          </>
        ) : (
          <ItineraryTable itinerary={event.itinerary} eventUUID={event.uuid} />
        )}
      </Grid>
    </Grid>
  );
}
