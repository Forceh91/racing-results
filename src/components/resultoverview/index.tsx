import Box from "@mui/material/Box";
import { ResultOverview } from "types";

type ResultOverviewEntryProps = {
  as?: React.ElementType;
} & ResultOverview;

export default function ResultOverviewEntry(props: ResultOverviewEntryProps) {
  const { as: Component = Box, date, circuit, winner, fastest_lap, pole, ranked } = props ?? {};

  return (
    <>
      <Component>{date}</Component>
      <Component>{circuit.name}</Component>
      <Component>{circuit.laps}</Component>
      <Component>
        {winner.name} - {winner.time}
      </Component>
      <Component>{fastest_lap ? `${fastest_lap.name} - ${fastest_lap.time} (Lap ${fastest_lap.lap})` : "-"}</Component>
      <Component>{pole.name}</Component>
      <Component>{ranked ? "Yes" : "No"}</Component>
    </>
  );
}
