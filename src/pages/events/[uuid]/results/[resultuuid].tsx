import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { ResultType } from "types";
import { numericColumn, StyledTableRow } from "lib/table";
import { useRouter } from "next/router";
import { useEventResult } from "hooks";
import { convertLengthToKM } from "lib/circuit";
import PenaltyEntry from "components/penalty";
import { ResultsTable } from "components/results";
import { AggregateResultsTable } from "components/results";

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

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1">Result - {event.name}</Typography>

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
                    .map((eventResult, ix, _eventResults) => (
                      <>
                        {isRally && _eventResults[ix - 1]?.leg !== eventResult.leg ? (
                          <Box
                            sx={{
                              alignItems: "center",
                              background: "#3719d2",
                              borderRadius: 1,
                              color: "white",
                              display: "flex",
                              mb: 1,
                              mr: 1,
                              py: 1,
                              px: 2,
                              textTransform: "uppercase",
                            }}
                          >
                            <Typography>Leg {eventResult.leg}</Typography>
                          </Box>
                        ) : (
                          <></>
                        )}
                        <Box sx={{ "&:not(:last-child)": { marginRight: 1 } }} key={eventResult.uuid}>
                          <Link href={`/events/${event.uuid}/results/${eventResult.uuid}`}>
                            <Button variant="contained" size="large" color="primary">
                              <Typography>Stage {eventResult.event_result_number}</Typography>
                            </Button>
                          </Link>
                        </Box>
                      </>
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
                  <ResultsTable results={results} resultType={type} />
                </Box>
                {aggregate_results?.length ? (
                  <Box sx={{ marginLeft: 4, width: "100%" }}>
                    <Typography sx={{ marginBottom: 2, fontWeight: 700 }}>Overall Results</Typography>
                    <AggregateResultsTable results={aggregate_results} />
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
