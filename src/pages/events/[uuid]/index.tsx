import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";
import { useEvent } from "hooks/useEvents";
import { numericColumn, StyledTableRow } from "lib/table";
import { sortAggregatedResults } from "lib/results";
import { useRouter } from "next/router";
import AggregatedResultDriverEntry from "components/aggregatedresultdriverentry";
import { AggregateResultsTable } from "components/results";

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
  const latestEventResult = (event.results?.length && event.results[event.event_result_number - 1]) ?? false;

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ my: 1 }}>
          <Typography variant="h2" sx={{ marginTop: 2 }}>
            Event - {event.name}
          </Typography>
        </Box>

        {/* if we've got aggregated results we should show them as priority rather than a list of results to click into */}
        {sortedAggregateResults && (
          <>
            <Box sx={{ my: 2, display: "flex" }}>
              {latestEventResult && (
                <Link href={`/events/${event.uuid}/results/${latestEventResult.uuid}`}>
                  <Button variant="contained" size="large" color="primary">
                    <Typography>Stage Results</Typography>
                  </Button>
                </Link>
              )}
            </Box>

            <Box sx={{ my: 1 }}>
              <Typography variant="h3" sx={{ marginTop: 2 }}>
                Overall Standings (After {event.event_result_number} stages)
              </Typography>
            </Box>

            <AggregateResultsTable results={sortedAggregateResults} />
          </>
        )}
      </Grid>
    </Grid>
  );
}
