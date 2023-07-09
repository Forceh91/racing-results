import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import { format, parseISO } from "date-fns";
import { numericColumn } from "lib/results";
import { convertMillsecondsToString } from "lib/time";
import { ResultEntry } from "types";

type ResultOverviewEntryProps = {
  as?: React.ElementType;
  pos: number;
  winner: ResultEntry;
  fastestLapHolder: string;
} & ResultEntry;

export default function ResultDriverEntry(props: ResultOverviewEntryProps) {
  const {
    as: Component = Box,
    pos,
    driver_uuid,
    driver_number,
    name,
    car,
    finished,
    laps,
    time,
    fastest_lap,
    grid,
    winner,
    fastestLapHolder,
  } = props ?? {};

  const { time: leaderTime, laps: leaderLaps } = winner;

  const formattedRaceTime = (time: number, isGap: boolean = false) => {
    if (!finished) {
      if (!isGap) return "";
      if (laps < leaderLaps) return `+${leaderLaps - laps}L`;
      return "";
    }

    return `${isGap ? "+" : ""}${convertMillsecondsToString(time, isGap)}`;
  };

  const formattedLapTime = (time: number) => convertMillsecondsToString(time);

  const formattedFastestLap = () => {
    if (!fastest_lap?.time) return "-";

    return (
      <>
        {fastestLapHolder === driver_uuid && (
          <Box component="strong" sx={{ color: "magenta" }}>
            {formattedLapTime(fastest_lap.time)}
          </Box>
        )}
        {fastestLapHolder !== driver_uuid && formattedLapTime(fastest_lap.time)}
        <br />
        Lap {fastest_lap.lap}
      </>
    );
  };

  return (
    <>
      <Component sx={numericColumn}>{finished ? pos : ""}</Component>
      <Component sx={{ textAlign: "center" }}>{driver_number}</Component>
      <Component>{name}</Component>
      <Component>{car}</Component>
      <Component sx={numericColumn}>{laps}</Component>
      <Component sx={numericColumn}>{formattedRaceTime(time)}</Component>
      <Component sx={numericColumn}>{formattedRaceTime(time - leaderTime, true)}</Component>
      <Component sx={numericColumn}>{formattedFastestLap()}</Component>
      <Component sx={numericColumn}>{grid}</Component>
    </>
  );
}
