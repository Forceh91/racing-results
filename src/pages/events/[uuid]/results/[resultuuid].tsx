import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";

import { ResultEntry, ResultType } from "types";
import ResultDriverEntry from "components/resultdriverentry";
import { sortResults } from "lib/results";
import { numericColumn } from "lib/table";
import { useRouter } from "next/router";
import { useEventResult } from "hooks";
import AggregatedResultDriverEntry from "components/aggregatedresultdriverentry";
import { convertLengthToKM } from "lib/circuit";

export default function ResultPage() {
  const router = useRouter();
  const { data: result, error, isLoading, isSuccess } = useEventResult(router.query.resultuuid as string);

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

  const { event, event_result_number, circuit, results, fastest_lap, type, aggregate_results } = result ?? {};

  const isRally = type === ResultType.RALLY;
  const sortedResults = sortResults(results);
  const winner = sortedResults[0];

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1">Result</Typography>

          <Typography variant="h2">
            {isRally ? `${event_result_number.toString().padStart(2, "0")}.` : ""} {circuit.name}{" "}
            {circuit.length ? `(${convertLengthToKM(circuit.length)}km)` : ""}
          </Typography>
        </Box>

        <Grid container>
          <Grid item xs={12}>
            {isRally && (
              <Box sx={{ my: 2, display: "flex" }}>
                <Link href={`/events/${event.uuid}`}>
                  <Button variant="contained" size="large" color="primary">
                    <Typography>Overall Results</Typography>
                  </Button>
                </Link>

                {event.results?.length &&
                  event.results
                    .sort((a, b) => a.event_result_number - b.event_result_number)
                    .map((eventResult) => (
                      <Link href={`/events/${event.uuid}/results/${eventResult.uuid}`} key={eventResult.uuid}>
                        <Button variant="contained" size="large" color="primary" sx={{ marginLeft: 1 }}>
                          <Typography>Stage {eventResult.event_result_number}</Typography>
                        </Button>
                      </Link>
                    ))}
              </Box>
            )}

            {!results.length && (
              <Alert variant="filled" severity="warning">
                No results are available yet
              </Alert>
            )}

            {results.length ? (
              <Box sx={{ my: 2, display: "flex" }}>
                <Box>
                  <Typography sx={{ marginBottom: 2, fontWeight: 500 }}>{isRally ? "Stage" : ""} Results</Typography>
                  <TableContainer sx={{ marginTop: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={numericColumn}>Pos</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Car/Team</TableCell>
                          {!isRally && <TableCell sx={numericColumn}>Laps</TableCell>}
                          <TableCell sx={numericColumn}>Time</TableCell>
                          <TableCell sx={numericColumn}>Gap</TableCell>
                          {!isRally && <TableCell sx={numericColumn}>Fastest Lap</TableCell>}
                          {!isRally && <TableCell sx={numericColumn}>Grid</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.map((result: ResultEntry, ix: number) => (
                          <TableRow key={result.driver_uuid} sx={{ opacity: result.finished ? 1 : 0.6 }}>
                            <ResultDriverEntry
                              {...result}
                              as={TableCell}
                              winner={winner}
                              pos={ix + 1}
                              isRally={isRally}
                            ></ResultDriverEntry>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                {aggregate_results?.length ? (
                  <Box sx={{ marginLeft: 4 }}>
                    <Typography sx={{ marginBottom: 2, fontWeight: 500 }}>Overall Results</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={numericColumn}>Pos</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Car/Team</TableCell>
                            <TableCell sx={numericColumn}>Time</TableCell>
                            <TableCell sx={numericColumn}>Gap</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {aggregate_results.map((result, ix) => (
                            <TableRow key={result.driver_uuid}>
                              <AggregatedResultDriverEntry
                                {...result}
                                as={TableCell}
                                winner={aggregate_results[0]}
                                pos={ix + 1}
                              />
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <></>
                )}
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
