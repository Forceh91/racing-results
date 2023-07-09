import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Result, ResultEntry, ResultFastestLap } from "types";
import ResultCircuit from "components/resultcircuit";
import mockResult from "mocks/mockResult.json";
import { useEffect, useState } from "react";
import ResultDriverEntry from "components/resultdriverentry";
import { numericColumn, sortResults } from "lib/results";
import { format, parseISO } from "date-fns";

type ResultPageProps = {};

export default function ResultPage() {
  const [result, setResult] = useState<Result>();
  useEffect(() => {
    setResult(mockResult);
  }, []);

  if (!result) return <>Loading...</>;

  const { circuit, results, fastest_lap, date } = result ?? {};
  const formattedRaceDate = format(parseISO(date), "PPP HH:mm:ss");
  const sortedResults = sortResults(results);
  const winner = sortedResults[0];
  const fastestLapHolder = results.find((result: ResultEntry) => result.driver_uuid === fastest_lap?.driver_uuid)?.name;
  const averageFastestLapTime =
    results
      .map((result: ResultEntry) => result.fastest_lap)
      .reduce((previousSum: number, currentFastestLap: ResultFastestLap) => previousSum + currentFastestLap.time, 0) /
    results.length;

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1" sx={{ marginBottom: 2 }}>
          Race Result - {formattedRaceDate}
        </Typography>

        <Grid container>
          <Grid item xs={3}>
            <ResultCircuit
              {...circuit}
              fastestLap={{ ...winner.fastest_lap, name: fastestLapHolder }}
              averageFastestLap={averageFastestLapTime}
            />
          </Grid>

          <Grid item xs={9}>
            <TableContainer sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={numericColumn}>Pos</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>#</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Car</TableCell>
                    <TableCell sx={numericColumn}>Laps</TableCell>
                    <TableCell sx={numericColumn}>Time</TableCell>
                    <TableCell sx={numericColumn}>Gap</TableCell>
                    <TableCell sx={numericColumn}>Fastest Lap</TableCell>
                    <TableCell sx={numericColumn}>Grid</TableCell>
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
                        fastestLapHolder={fastest_lap?.driver_uuid ?? ""}
                      ></ResultDriverEntry>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
