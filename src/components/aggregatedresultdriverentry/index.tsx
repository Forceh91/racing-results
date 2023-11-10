import Box from "@mui/material/Box";
import { numericColumn } from "lib/table";
import { convertMillsecondsToString } from "lib/time";
import { AggregatedResultEntry, ResultEntry } from "types";

type AggregatedResultOverviewEntryProps = {
  as?: React.ElementType;
  pos: number;
  winner: AggregatedResultEntry;
} & AggregatedResultEntry;

export default function AggregatedResultDriverEntry(props: AggregatedResultOverviewEntryProps) {
  const {
    as: Component = Box,
    pos,
    driver_number,
    driver: { name },
    team,
    car,
    time,
    winner,
  } = props ?? {};

  const { time: leaderTime } = winner;

  const formattedRaceTime = (time: number, isGap: boolean = false) => {
    return `${isGap ? "+" : ""}${convertMillsecondsToString(time, isGap)}`;
  };

  return (
    <>
      <Component sx={numericColumn}>{pos}</Component>
      <Component sx={{ fontWeight: 700 }}>{name}</Component>
      <Component>
        {car}
        <br />
        {team ? team.name : "-"}
      </Component>
      <Component sx={numericColumn}>{formattedRaceTime(time)}</Component>
      <Component sx={numericColumn}>{formattedRaceTime(time - leaderTime, true)}</Component>
    </>
  );
}
