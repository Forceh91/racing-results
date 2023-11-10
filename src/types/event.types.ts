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
  results: EventResultIdentifiers;
  aggregated_results: AggregatedResultEntry[];
  event_result_number: number;
};

export type EventResultIdentifier = {
  uuid: string;
  event_result_number: number;
};

export type EventResultIdentifiers = EventResultIdentifier[];
