import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import { format, parseISO } from "date-fns";
import { convertMillsecondsToString } from "lib/time";
import { ResultOverview } from "types";

type ResultOverviewEntryProps = {
  as?: React.ElementType;
} & ResultOverview;

export default function ResultOverviewEntry(props: ResultOverviewEntryProps) {
  const { as: Component = Box, date, circuit, winner, fastest_lap, pole, ranked, uuid } = props ?? {};

  const formattedDate = (date: string) => {
    return format(parseISO(date), "yyyy-MM-dd HH:mm:ss");
  };

  const formattedTime = (time: number) => {
    return convertMillsecondsToString(time);
  };

  return (
    <>
      <Component>{formattedDate(date)}</Component>
      <Component>{circuit.name}</Component>
      <Component>{circuit.laps}</Component>
      <Component>
        {winner.name} - {formattedTime(winner.time)}
      </Component>
      <Component>
        {fastest_lap ? `${fastest_lap.name} - ${formattedTime(fastest_lap.time)} (Lap ${fastest_lap.lap})` : "-"}
      </Component>
      <Component>{pole.name}</Component>
      <Component>{ranked ? "Yes" : "No"}</Component>
      <Component>
        <Link href={`/result/${uuid}/`}>View Results</Link>
      </Component>
    </>
  );
}
