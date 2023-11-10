import { AggregatedResultEntry } from "./result.types";

export type EventOverview = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
  results: Array<unknown>;
};

export type Event = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
  results: Array<unknown>;
  aggregated_results: Array<AggregatedResultEntry>;
  event_result_number?: number;
};
