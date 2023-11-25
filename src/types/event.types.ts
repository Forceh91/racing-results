import { Circuit } from "./circuit.types";
import {
  AggregatedResultEntry,
  Result,
  ResultAggregateResults,
  ResultEntries,
  ResultPenalties,
  ResultType,
} from "./result.types";

export type Event = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
};

export type EventOverview = Event & {
  has_itinerary: boolean;
} & Event;

export type EventAggregatedResults = {
  aggregated_results: Array<AggregatedResultEntry>;
};

export type EventAggregatedResultRetirement = {
  retirements: Array<AggregatedResultEntry>;
};

export type EventItinerary = {
  itinerary: Array<ItineraryEntry>;
};

export type ItineraryEntry = {
  uuid: string;
  type: ResultType;
  event_result_number: number;
  leg: number;
  circuit: Circuit;
};

export type EventDetails = Event &
  EventAggregatedResults &
  EventAggregatedResultRetirement &
  EventItinerary & { last_event_result_number: number; last_result_uuid: string };

export type EventItineraryDetailed = EventItinerary & {
  event: Event;
  has_aggregated_results: boolean;
  latest_result_uuid: string | null;
};

export type EventResult = {
  event: Event;
} & Result &
  EventItinerary &
  ResultEntries &
  ResultAggregateResults &
  ResultPenalties;

export type _EventOverview = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
  results: Array<unknown>;
};

export type _Event = {
  uuid: string;
  name: string;
  start_date: string;
  end_date?: string;
  results: _EventResultIdentifiers;
  aggregated_results: AggregatedResultEntry[];
  retirements: AggregatedResultEntry[];
  event_result_number: number;
};

export type _EventResultIdentifier = {
  uuid: string;
  event_result_number: number;
  leg: number;
  type: ResultType;
  circuit: {
    name: string;
    length: number;
  };
};

export type _ResultEvent = {
  uuid: string;
  name: string;
  results: _ResultEventItinerary[];
};

export type _ResultEventItinerary = {
  uuid: string;
  event_result_number: number;
  leg: number;
};

export type _EventResultIdentifiers = _EventResultIdentifier[];
