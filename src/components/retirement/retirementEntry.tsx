import Box from "@mui/material/Box";
import { TextWithNationalityFlagSuffix } from "components/ui";
import { AggregatedResultEntry } from "types";

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

  return (
    <>
      <Component>
        {isRally ? "Stage " : ""}
        {event_result_number}
      </Component>
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
      <Component>{retired_reason ?? "-"}</Component>
    </>
  );
}
