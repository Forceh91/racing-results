import Box from "@mui/material/Box";
import { numericColumn, sxSubData } from "lib/table";
import { ResultEntry } from "types";
import Flags from "country-flag-icons/react/3x2";
import { formatGap, formatLapTime, formatRaceTime } from "lib/time";

type ResultOverviewEntryProps = {
  as?: React.ElementType;
  pos: number;
  winner: ResultEntry;
  previousEntry?: ResultEntry;
  fastestLapHolder?: string;
  isRally: boolean;
} & ResultEntry;

export default function ResultDriverEntry(props: ResultOverviewEntryProps) {
  const {
    as: Component = Box,
    pos,
    driver_uuid,
    driver: { name, nationality },
    team,
    car,
    finished,
    laps,
    time,
    fastest_lap,
    grid,
    winner,
    fastestLapHolder,
    isRally,
    previousEntry,
  } = props ?? {};

  const formattedFastestLap = () => {
    if (!fastest_lap?.time) return "-";

    return (
      <>
        {fastestLapHolder === driver_uuid && (
          <Box component="strong" sx={{ color: "magenta" }}>
            {formatLapTime(fastest_lap.time)}
          </Box>
        )}
        {fastestLapHolder !== driver_uuid && formatLapTime(fastest_lap.time)}
        <br />
        Lap {fastest_lap.lap}
      </>
    );
  };

  const Nationality = () => {
    if (!nationality?.length) return <></>;
    // TODO: fix this error
    const FlagComponent = Flags[nationality];
    return <FlagComponent />;
  };

  return (
    <>
      <Component sx={numericColumn}>{finished ? pos : ""}</Component>
      <Component sx={{ fontWeight: 700, svg: { height: "1em", mr: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nationality && <Nationality />}
          {name}
        </Box>
      </Component>
      <Component>
        {car?.name}
        <br />
        {team?.name ?? "-"}
      </Component>
      {!isRally && <Component sx={numericColumn}>{laps ?? "-"}</Component>}
      <Component sx={numericColumn}>{formatRaceTime(time, finished)}</Component>
      <Component sx={numericColumn}>
        {formatGap(time, winner, finished, laps)}
        {previousEntry && <Box sx={sxSubData}>{formatGap(time, previousEntry, finished, laps)}</Box>}
      </Component>
      {!isRally && (
        <>
          <Component sx={numericColumn}>{formattedFastestLap()}</Component>
          <Component sx={numericColumn}>{grid ?? "-"}</Component>
        </>
      )}
    </>
  );
}
