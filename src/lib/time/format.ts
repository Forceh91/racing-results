import { AggregatedResultEntry, ResultEntry } from "types";
import { convertMillisecondsToMinSecString, convertMillsecondsToString } from "./time";

export const formatRaceTime = (time: number, finished: boolean = true) =>
  finished ? convertMillsecondsToString(time) : "";

export const formatGap = (time: number, comparison: ResultEntry, finished: boolean = true, laps: number = 0) => {
  if (laps && comparison.laps && laps < comparison.laps) return `+${comparison.laps - laps}L`;
  return finished ? `+${convertMillsecondsToString(time - comparison.time, true)}` : "";
};

export const formatGapAsTimeOnly = (
  time: number,
  comparison: ResultEntry | AggregatedResultEntry,
  finished: boolean = true
) => (finished ? `+${convertMillsecondsToString(time - comparison.time, true)}` : "");

export const formatLapTime = (time: number) => convertMillsecondsToString(time);

export const formatPenaltyTime = (time: number) => convertMillisecondsToMinSecString(time);
