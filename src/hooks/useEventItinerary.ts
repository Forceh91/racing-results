import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { EventItineraryDetailed } from "types";

export const useEventItinerary = (uuid: string) => {
  return useQuery({
    queryKey: ["eventItinerary", uuid],
    queryFn: async () => {
      const { data } = await axios.get<EventItineraryDetailed>(`/events/${uuid}/itinerary`);
      return data;
    },
    enabled: !!uuid,
  });
};
