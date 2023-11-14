import Box from "@mui/material/Box";
import { AggregatedResultEntry } from "types";
import Flags from "country-flag-icons/react/3x2";

type RetirementEntryProps = {
  as?: React.ElementType;
  isRally?: boolean;
} & AggregatedResultEntry;

export default function RetirementEntry(props: RetirementEntryProps) {
  const {
    as: Component = Box,
    isRally,
    driver: { name, nationality },
    car,
    team,
    retired_reason,
    event_result_number,
  } = props ?? {};

  const Nationality = () => {
    if (!nationality?.length) return <></>;
    // TODO: fix this error
    const FlagComponent = Flags[nationality];
    return <FlagComponent />;
  };

  return (
    <>
      <Component>
        {isRally ? "Stage " : ""}
        {event_result_number}
      </Component>
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
      <Component>{retired_reason ?? "-"}</Component>
    </>
  );
}
