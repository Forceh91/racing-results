import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { EventHeader, ItineraryTable } from "components/events";
import { useRouter } from "next/router";
import { useEventItineraryQuery } from "hooks";

export const EventItinerary = () => {
  const router = useRouter();
  const { data, error, isLoading, isSuccess } = useEventItineraryQuery(router.query.uuid as string);

  if (isLoading)
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
          event={data.event}
          hasAggregatedResults={data.has_aggregated_results}
          latestResultUUID={data.latest_result_uuid}
        />
        <Typography variant="h2" sx={{ fontWeight: 400 }}>
          Itinerary
        </Typography>
        <ItineraryTable itinerary={data.itinerary} eventUUID={data.event.uuid} />
      </Grid>
    </Grid>
  );
};

export default EventItinerary;
