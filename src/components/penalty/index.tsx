import Box from "@mui/material/Box";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { numericColumn } from "lib/table";
import { formatPenaltyTime } from "lib/time";
import { Penalty } from "types";

type PenaltyEntryProps = {
  as?: React.ElementType;
} & Penalty;

export default function PenaltyEntry(props: PenaltyEntryProps) {
  const {
    as: Component = Box,
    driver: { name, nationality },
    time,
    reason,
  } = props ?? {};

  return (
    <>
      <Component sx={{ fontWeight: 700 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nationality && <TextWithNationalityFlagSuffix nationality={nationality} text={name} />}
          {!nationality && <>{name}</>}
        </Box>
      </Component>
      <Component sx={{ ...numericColumn, color: "red" }}>{formatPenaltyTime(time)}</Component>
      <Component>{reason}</Component>
    </>
  );
}
