import Box from "@mui/material/Box";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { numericColumn, sxSubData } from "lib/table";
import { formatGapAsTimeOnly, formatRaceTime } from "lib/time";
import { AggregatedResultEntry } from "types";

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

  return (
    <>
      <Component sx={numericColumn}>{pos}</Component>
      <Component sx={{ fontWeight: 700 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nationality && <TextWithNationalityFlagSuffix nationality={nationality} text={name} />}
          {!nationality && <>{name}</>}
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
