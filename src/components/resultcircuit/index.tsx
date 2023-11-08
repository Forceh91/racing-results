import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { format, parseISO } from "date-fns";
import { Circuit, ResultFastestLap } from "types";
import { convertMillsecondsToString } from "lib/time";
import { SxProps } from "@mui/material";
import { convertLengthToKM } from "lib/circuit";

type ResultCircuitProps = {
  fastestLap?: ResultFastestLap;
  averageFastestLap?: number;
} & Circuit;

const typographyH1Sx: SxProps = { fontSize: "2rem", fontWeight: 700, marginBottom: 1 };

export default function ResultCircuit(props: ResultCircuitProps) {
  const { uuid, name, length, first_seen, laps, fastestLap, averageFastestLap } = props ?? {};
  const distanceInKM = length ? `${convertLengthToKM(length)}km` : "-";
  const formattedFirstSeen = first_seen ? format(parseISO(first_seen), "PPP") : "-";
  const formattedFastestLap = fastestLap?.time ? (
    <>
      {convertMillsecondsToString(fastestLap.time)}
      <br />
      Lap {fastestLap.lap}, {fastestLap.name}
    </>
  ) : (
    "-"
  );
  const formattedAverageLap = averageFastestLap ? convertMillsecondsToString(averageFastestLap) : "-";

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            Circuit
          </Typography>
          <Typography>
            <Link href={`/circuit/${uuid}/`}>{name ?? "-"}</Link>
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            Distance
          </Typography>
          <Typography>{distanceInKM}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            Laps
          </Typography>
          <Typography>{laps ?? "-"}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            Fastest Lap
          </Typography>
          <Typography>{formattedFastestLap}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            Avg. Fastest Lap
          </Typography>
          <Typography>{formattedAverageLap}</Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h1" sx={typographyH1Sx}>
            First Race
          </Typography>
          <Typography>{formattedFirstSeen}</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
