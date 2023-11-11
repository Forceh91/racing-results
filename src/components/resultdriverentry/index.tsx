import Box from "@mui/material/Box";
import { numericColumn } from "lib/table";
import { convertMillsecondsToString } from "lib/time";
import { ResultEntry } from "types";
import Flags from "country-flag-icons/react/3x2";

type ResultOverviewEntryProps = {
  as?: React.ElementType;
  pos: number;
  winner: ResultEntry;
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
  } = props ?? {};

  const { time: leaderTime, laps: leaderLaps } = winner;

  const formattedRaceTime = (time: number, isGap: boolean = false) => {
    if (laps && leaderLaps && laps < leaderLaps && isGap) return `+${leaderLaps - laps}L`;

    if (!finished) return "";
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
        {car}
        <br />
        {team?.name ?? "-"}
      </Component>
      {!isRally && <Component sx={numericColumn}>{laps ?? "-"}</Component>}
      <Component sx={numericColumn}>{formattedRaceTime(time)}</Component>
      <Component sx={numericColumn}>{formattedRaceTime(time - leaderTime, true)}</Component>
      {!isRally && (
        <>
          <Component sx={numericColumn}>{formattedFastestLap()}</Component>
          <Component sx={numericColumn}>{grid ?? "-"}</Component>
        </>
      )}
    </>
  );
}
