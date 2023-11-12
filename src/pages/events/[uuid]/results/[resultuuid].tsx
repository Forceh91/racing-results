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

import { ResultType } from "types";
import ResultDriverEntry from "components/resultdriverentry";
import { sortResults } from "lib/results";
import { numericColumn, StyledTableRow } from "lib/table";
import { useRouter } from "next/router";
import { useEventResult } from "hooks";
import AggregatedResultDriverEntry from "components/aggregatedresultdriverentry";
import { convertLengthToKM } from "lib/circuit";
import PenaltyEntry from "components/penalty";

export default function ResultPage() {
  const router = useRouter();
  const { data: result, error, isLoading, isSuccess } = useEventResult(router.query.resultuuid as string);

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

  const { event, event_result_number, circuit, results, fastest_lap, type, aggregate_results, penalty } = result ?? {};

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
              <Box sx={{ my: 2, display: "flex", flexWrap: "wrap", alignContent: "space-between" }}>
                <Link href={`/events/${event.uuid}`}>
                  <Button variant="contained" size="large" color="primary" sx={{ mb: 1, mr: 1 }}>
                    <Typography>Overall Results</Typography>
                  </Button>
                </Link>

                {event.results?.length &&
                  event.results
                    .sort((a, b) => a.event_result_number - b.event_result_number)
                    .map((eventResult) => (
                      <Box sx={{ "&:not(:last-child)": { marginRight: 1 } }} key={eventResult.uuid}>
                        <Link href={`/events/${event.uuid}/results/${eventResult.uuid}`}>
                          <Button variant="contained" size="large" color="primary">
                            <Typography>Stage {eventResult.event_result_number}</Typography>
                          </Button>
                        </Link>
                      </Box>
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
                <Box sx={{ width: "100%" }}>
                  <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>{isRally ? "Stage" : ""} Results</Typography>
                  <TableContainer sx={{ marginTop: 2 }}>
                    <Table stickyHeader>
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
                        {results.map((result, ix) => (
                          <StyledTableRow key={result.driver_uuid} sx={{ opacity: result.finished ? 1 : 0.6 }}>
                            <ResultDriverEntry
                              {...result}
                              as={TableCell}
                              winner={winner}
                              pos={ix + 1}
                              isRally={isRally}
                            ></ResultDriverEntry>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                {aggregate_results?.length ? (
                  <Box sx={{ marginLeft: 4, width: "100%" }}>
                    <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>Overall Results</Typography>
                    <TableContainer>
                      <Table stickyHeader>
                        <TableHead>
                          <StyledTableRow>
                            <TableCell sx={numericColumn}>Pos</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Car/Team</TableCell>
                            <TableCell sx={numericColumn}>Time</TableCell>
                            <TableCell sx={numericColumn}>Gap</TableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {aggregate_results.map((result, ix) => (
                            <StyledTableRow key={result.driver_uuid}>
                              <AggregatedResultDriverEntry
                                {...result}
                                as={TableCell}
                                winner={aggregate_results[0]}
                                pos={ix + 1}
                              />
                            </StyledTableRow>
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

            {penalty?.length ? (
              <Box sx={{ my: 2 }}>
                <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>Penalties</Typography>
                <TableContainer sx={{ marginTop: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Driver</TableCell>
                        <TableCell sx={numericColumn}>Penalty</TableCell>
                        <TableCell>Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {penalty.map((penalty) => (
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
