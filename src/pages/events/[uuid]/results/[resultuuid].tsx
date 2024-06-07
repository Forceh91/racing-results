import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { EventHeader } from "components/events";
import PenaltyEntry from "components/penalty";
import { AggregateResultsTable, ResultsTable, StageList } from "components/results";
import { useEventResultQuery } from "hooks";
import { convertLengthToKM } from "lib/circuit";
import { numericColumn, StyledTableRow, sxBoldTableHeaders } from "lib/table";
import { useRouter } from "next/router";
import { ResultType } from "types";

export default function ResultPage() {
  const router = useRouter();
  const { data, error, isLoading, isSuccess } = useEventResultQuery(router.query.resultuuid as string);

  if (isLoading || !router.query.uuid)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="info">
            Fetching results...
          </Alert>
        </Grid>
      </Grid>
    );

  if (error || !isSuccess)
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Alert variant="filled" severity="error">
            Unable to fetch results
          </Alert>
        </Grid>
      </Grid>
    );

  const {
    uuid,
    event,
    event_result_number,
    circuit,
    results,
    fastest_lap,
    type,
    aggregated_results,
    penalties,
    itinerary,
  } = data;
  const isRally = type === ResultType.RALLY;

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <EventHeader
            event={event}
            hasAggregatedResults={(aggregated_results && aggregated_results.length > 0) ?? false}
            latestResultUUID={uuid}
          />

          {isRally && itinerary.length ? (
            <StageList eventUUID={event.uuid} stages={itinerary} currentStage={event_result_number} />
          ) : (
            <></>
          )}

          <Typography variant="h2" sx={{ fontWeight: 400 }}>
            {isRally ? `Stage ${event_result_number.toString().padStart(2, "0")} -` : ""} {circuit.name}
            {" - "}
            {circuit.length ? `${convertLengthToKM(circuit.length)}km` : ""}
          </Typography>
        </Box>

        <Grid container>
          <Grid item xs={12}>
            {!results.length && (
              <Alert variant="filled" severity="warning">
                No results are available yet
              </Alert>
            )}

            {results.length ? (
              <Grid container sx={{ my: 2 }} columnSpacing={8} rowGap={4}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>{isRally ? "Stage" : ""} Results</Typography>
                  <ResultsTable results={results} resultType={type} />
                </Grid>
                {aggregated_results?.length ? (
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>Overall Results</Typography>
                    <AggregateResultsTable results={aggregated_results} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            ) : (
              <></>
            )}

            {penalties?.length ? (
              <Box sx={{ my: 2 }}>
                <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>Penalties</Typography>
                <TableContainer sx={{ marginTop: 2 }}>
                  <Table size="small">
                    <TableHead sx={sxBoldTableHeaders}>
                      <TableRow>
                        <TableCell>Driver</TableCell>
                        <TableCell sx={numericColumn}>Penalty</TableCell>
                        <TableCell>Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {penalties.map((penalty) => (
                        <StyledTableRow key={penalty.driver.uuid}>
                          <PenaltyEntry {...penalty} as={TableCell} />
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
