import { SxProps } from "@mui/material";
import { ResultEntry } from "types";

export function sortResults(results: ResultEntry[]) {
  return results.sort((a: ResultEntry, b: ResultEntry) => {
    const { finished: aFinished, laps: aLaps = 0, time: aTime } = a;
    const { finished: bFinished, laps: bLaps = 0, time: bTime } = b;

    // sort by laps
    if (aLaps > bLaps) return -1;
    if (bLaps > aLaps) return 1;

    // sort by finished
    if (aFinished > bFinished) return -1;
    if (bFinished > aFinished) return 1;

    // now by time
    return aTime - bTime;
  });
}
