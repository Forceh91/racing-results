export type Circuit = {
  uuid: string;
  name: string;
  first_seen?: string; // iso time
  length?: number; // metres
  laps?: number;
};

export type CircuitStats = {
  races: CircuitResult[];
} & Circuit;

export type CircuitResult = {
  date: string;
  uuid: string;
  laps: number;
};
