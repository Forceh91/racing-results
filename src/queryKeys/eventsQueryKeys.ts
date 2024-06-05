import { createQueryKeys } from "@lukemorales/query-key-factory";
import axios from "lib/axios";
import { EventDetails, EventItineraryDetailed, EventOverview, EventResult } from "types";

export default createQueryKeys("events", {
  all: {
    queryKey: null,
    queryFn: () => axios.get<EventOverview[]>("/events").then((resp) => resp.data),
  },
  detail: (uuid: string) => ({
    queryKey: [uuid],
    queryFn: () => axios.get<EventDetails>(`/events/${uuid}`).then((resp) => resp.data),
  }),
  results: (resultsUUID: string) => ({
    queryKey: [resultsUUID],
    queryFn: () => axios.get<EventResult>(`/results/${resultsUUID}`).then((resp) => resp.data),
  }),
  itinerary: (eventUUID: string) => ({
    queryKey: [eventUUID],
    queryFn: () => axios.get<EventItineraryDetailed>(`/events/${eventUUID}/itinerary`).then((resp) => resp.data),
  }),
});
