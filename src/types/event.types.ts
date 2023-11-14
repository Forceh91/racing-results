import { AggregatedResultEntry, ResultType } from "./result.types";

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
  retirements: AggregatedResultEntry[];
  event_result_number: number;
};

export type EventResultIdentifier = {
  uuid: string;
  event_result_number: number;
  leg: number;
  type: ResultType;
  circuit: {
    name: string;
    length: number;
  };
};

export type EventResultIdentifiers = EventResultIdentifier[];
