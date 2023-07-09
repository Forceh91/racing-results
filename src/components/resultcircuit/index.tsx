import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { format, parseISO } from "date-fns";
import { Circuit, ResultFastestLap } from "types";
import { convertMillsecondsToString } from "lib/time";

type ResultCircuitProps = {
  fastest_lap: ResultFastestLap;
} & Circuit;

export default function ResultCircuit(props: ResultCircuitProps) {
  const { uuid, name, length, first_seen, laps, fastest_lap } = props ?? {};
  const distanceInKM = length ? `${(length / 1000).toFixed(2)}km` : "-";
  const formattedFirstSeen = first_seen ? format(parseISO(first_seen), "PPP") : "-";
  const formattedFastestLap = fastest_lap?.time ? (
    <>
      {fastest_lap.name}
      <br />
      {convertMillsecondsToString(fastest_lap.time)}
      <br />
      Lap {fastest_lap.lap}
    </>
  ) : (
    "-"
  );

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1">Circuit</Typography>
          <Typography>
            <Link href={`/circuit/${uuid}/`}>{name ?? "-"}</Link>
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1">Distance</Typography>
          <Typography>{distanceInKM}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1">First Race</Typography>
          <Typography>{formattedFirstSeen}</Typography>
        </Box>
        <Box>
          <Typography variant="h1">Laps</Typography>
          <Typography>{laps ?? "-"}</Typography>
        </Box>
        <Box>
          <Typography variant="h1">Fastest Lap</Typography>
          <Typography>{formattedFastestLap}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
