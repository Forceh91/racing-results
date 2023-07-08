import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import mockResultOverview from "mocks/mockResultOverview.json";
import ResultOverviewEntry from "components/resultoverview";

export default function Home() {
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Typography variant="h1">{process.env.NEXT_PUBLIC_APP_NAME}</Typography>

        <Typography variant="h2" sx={{ marginTop: 2 }}>
          Latest Race Results
        </Typography>

        <TableContainer sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date/Time</TableCell>
                <TableCell>Circuit</TableCell>
                <TableCell>Laps</TableCell>
                <TableCell>Winner</TableCell>
                <TableCell>Fastest Lap</TableCell>
                <TableCell>Pole Position</TableCell>
                <TableCell>Ranked</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <ResultOverviewEntry {...mockResultOverview} as={TableCell}></ResultOverviewEntry>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
