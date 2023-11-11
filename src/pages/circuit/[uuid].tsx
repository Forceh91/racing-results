import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import StyledTableRow from "../components/styledtablerow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { format, parseISO } from "date-fns";
import { CircuitResult, CircuitStats } from "types";
import mockCircuitStats from "mocks/mockCircuitStats.json";
import { convertLengthToKM, sortedCircuitResults } from "lib/circuit";
import { numericColumn } from "lib/table";

type CircuitPageProps = {};

export default function CircuitPage() {
  const [circuitStats, setCircuitStats] = useState<CircuitStats>();
  useEffect(() => {
    setCircuitStats(mockCircuitStats);
  }, []);

  if (!circuitStats) return <>Loading...</>;

  const { name, first_seen: firstSeen, length, races } = circuitStats ?? {};
  const formatRaceDate = (date: string) => (date ? format(parseISO(date), "PPP HH:mm:ss") : "");
  const sortedRaces = sortedCircuitResults(races);

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1" sx={{ marginBottom: 2 }}>
          Circuit - {name}
        </Typography>

        <Typography variant="h2" sx={{ marginBottom: 2, fontSize: "1.75rem" }}>
          <strong>Length:</strong> {length ? `${convertLengthToKM(length)}km` : "-"} | <strong>First Seen:</strong>{" "}
          {firstSeen ? formatRaceDate(firstSeen) : "-"} | <strong>Total Races:</strong> {races.length}
        </Typography>

        <Grid item xs={12}>
          <TableContainer sx={{ marginTop: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Date/Time</TableCell>
                  <TableCell sx={numericColumn}>Laps</TableCell>
                  <TableCell></TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {sortedRaces.map((result: CircuitResult, ix: number) => (
                  <StyledTableRow key={result.uuid}>
                    <TableCell>{formatRaceDate(result.date)}</TableCell>
                    <TableCell sx={numericColumn}>{result.laps}</TableCell>
                    <TableCell>
                      <Link href={`/result/${result.uuid}`}>View Results</Link>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
