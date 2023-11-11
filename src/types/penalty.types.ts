import { Driver } from "./driver.types";

export type Penalty = {
  driver: Driver;
  time: number;
  reason: string;
};
