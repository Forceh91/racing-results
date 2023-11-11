import Box from "@mui/material/Box";
import { numericColumn } from "lib/table";
import { convertMillsecondsToString } from "lib/time";
import { AggregatedResultEntry } from "types";
import Flags from "country-flag-icons/react/3x2";

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
    driver: { name, nationality },
    team,
    car,
    time,
    winner,
  } = props ?? {};

  const { time: leaderTime } = winner;

  const formattedRaceTime = (time: number, isGap: boolean = false) => {
    return `${isGap ? "+" : ""}${convertMillsecondsToString(time, isGap)}`;
  };

  const Nationality = () => {
    if (!nationality?.length) return <></>;
    // TODO: fix this error
    const FlagComponent = Flags[nationality];
    return <FlagComponent />;
  };

  return (
    <>
      <Component sx={numericColumn}>{pos}</Component>
      <Component sx={{ fontWeight: 700, svg: { height: "1em", mr: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nationality && <Nationality />}
          {name}
        </Box>
      </Component>
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
