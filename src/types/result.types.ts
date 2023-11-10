import { Circuit } from "./circuit.types";
import { Driver } from "./driver.types";
import { Team } from "./team.types";

export type Result = {
  uuid: string;
  date: string; // iso string
  ranked: boolean; // whether elo was calculated (x players needed)
  circuit: Circuit;
  fastest_lap?: ResultFastestLap;
  results: ResultEntry[];
  type: ResultType;
};

export enum ResultType {
  CIRCUIT = "CIRCUIT",
  RALLY = "RALLY",
}

export type ResultFastestLap = {
  driver_uuid?: string;
  name?: string;
  time: number; // milliseconds
  lap: number;
};

export type ResultEntry = {
  driver_uuid: string;
  driver_number: number;
  name: string;
  laps?: number;
  finished: boolean;
  time: number; // milliseconds
  car?: string;
  team?: Team;
  fastest_lap?: ResultFastestLap;
  grid?: number;
};

export type AggregatedResultEntry = {
  driver_uuid: string;
  driver: Driver;
  driver_number?: number;
  time: number; // milliseconds
  car?: string;
  team?: Team;
  event_result_number: number;
};

export type ResultOverview = {
  uuid: string;
  date: string; // iso string
  ranked: boolean; // whether elo was calculated (x players needed)
  circuit: Circuit;
  fastest_lap?: ResultFastestLap;
  winner?: ResultWinner;
  pole?: ResultPole;
};

export type ResultWinner = {
  driver_uuid: string;
  name: string;
  time: number;
};

export type ResultPole = { driver_uuid: string; name: string };
