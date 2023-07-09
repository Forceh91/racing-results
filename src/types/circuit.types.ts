export type Circuit = {
  uuid: string;
  name: string;
  first_seen?: string; // iso time
  length?: number; // metres
  laps?: number;
};
