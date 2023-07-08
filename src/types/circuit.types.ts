export type Circuit = {
  uuid: string;
  name: string;
  firstSeen: string; // iso time
  length: number; // metres
  laps?: number;
};
