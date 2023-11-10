import { AggregatedResultEntry, ResultEntry } from "types";

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

export function sortAggregatedResults(results: AggregatedResultEntry[]) {
  return results.sort((a, b) => {
    const { event_result_number: aEventResultNumber, time: aTime } = a;
    const { event_result_number: bEventResultNumber, time: bTime } = b;

    // sort by event_result_number
    if (aEventResultNumber > bEventResultNumber) return -1;
    if (bEventResultNumber > aEventResultNumber) return 1;

    // now by time
    return aTime - bTime;
  });
}
