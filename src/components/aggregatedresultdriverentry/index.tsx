import Box from "@mui/material/Box";
import { numericColumn, sxSubData } from "lib/table";
import { convertMillsecondsToString, formatGap, formatGapAsTimeOnly, formatRaceTime } from "lib/time";
import { AggregatedResultEntry } from "types";
import Flags from "country-flag-icons/react/3x2";

type AggregatedResultOverviewEntryProps = {
  as?: React.ElementType;
  pos: number;
  winner: AggregatedResultEntry;
  previousEntry?: AggregatedResultEntry;
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
    previousEntry,
  } = props ?? {};

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
        {car?.name}
        <br />
        {team ? team.name : "-"}
      </Component>
      <Component sx={numericColumn}>{formatRaceTime(time)}</Component>
      <Component sx={numericColumn}>
        {formatGapAsTimeOnly(time, winner)}
        {previousEntry && <Box sx={sxSubData}>{formatGapAsTimeOnly(time, previousEntry)}</Box>}
      </Component>
    </>
  );
}
