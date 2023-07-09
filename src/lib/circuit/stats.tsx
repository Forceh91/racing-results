import { CircuitResult } from "types";

export function sortedCircuitResults(results: CircuitResult[]) {
  return results.sort((a: CircuitResult, b: CircuitResult) => {
    const { date: aDate } = a;
    const { date: bDate } = b;

    // sort by time (newest first)
    if (aDate > bDate) return -1;
    if (bDate > aDate) return 1;
    return 0;
  });
}

export function convertLengthToKM(length: number) {
  return (length / 1000).toFixed(2);
}
