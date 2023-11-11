import Box from "@mui/material/Box";
import { numericColumn } from "lib/table";
import { convertMillsecondsToString } from "lib/time";
import { Penalty } from "types";
import Flags from "country-flag-icons/react/3x2";

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

  const Nationality = () => {
    if (!nationality?.length) return <></>;
    // TODO: fix this error
    const FlagComponent = Flags[nationality];
    return <FlagComponent />;
  };

  return (
    <>
      <Component sx={{ fontWeight: 700, svg: { height: "1em", mr: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {nationality && <Nationality />}
          {name}
        </Box>
      </Component>
      <Component sx={{ ...numericColumn, color: "red" }}>{convertMillsecondsToString(time)}</Component>
      <Component>{reason}</Component>
    </>
  );
}
