import { Circuit } from "./circuit.types";
import { Team } from "./team.types";

export type Result = {
  uuid: string;
  date: string; // iso string
  ranked: boolean; // whether elo was calculated (x players needed)
  circuit: Circuit;
  fastestLap?: ResultFastestLap;
  results: ResultEntry[];
};

export type ResultFastestLap = {
  driverUUID?: string;
  time: number; // milliseconds
  lap: number;
};

export type ResultEntry = {
  driverUUID: string;
  name: string;
  laps: number;
  finished: boolean;
  time: number; // milliseconds
  car?: string;
  team?: Team;
  fastestLap: ResultFastestLap;
  grid: number;
};
