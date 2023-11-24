import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { EventHeader, EventResultsTable } from "components/events";
import { useRouter } from "next/router";
import { useEvent, useEventItinerary } from "hooks";

export const EventItinerary = () => {
  const router = useRouter();
  const eventUUID = router.query.uuid as string;
  const { data: eventItinerary, error, isLoading, isSuccess } = useEventItinerary(eventUUID);
  const { data: event } = useEvent(eventUUID);

  if (isLoading || !eventUUID)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="info">
            Fetching event itinerary...
          </Alert>
        </Grid>
      </Grid>
    );

  if (error || !isSuccess)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="error">
            Unable to fetch event itinerary
          </Alert>
        </Grid>
      </Grid>
    );

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <EventHeader
          event={eventItinerary}
          hasAggregatedResults={(event?.aggregated_results && event.aggregated_results.length > 0) ?? false}
          latestResultUUID={(event?.results && event.results[event.event_result_number - 1]?.uuid) ?? ""}
        />
        <Typography variant="h2" sx={{ fontWeight: 400 }}>
          Itinerary
        </Typography>
        <EventResultsTable eventResults={eventItinerary.results} eventUUID={eventItinerary.uuid} />
      </Grid>
    </Grid>
  );
};

export default EventItinerary;
