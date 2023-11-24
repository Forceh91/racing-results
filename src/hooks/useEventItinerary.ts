import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { Event } from "types";

export const useEventItinerary = (uuid: string) => {
  return useQuery({
    queryKey: ["eventItinerary", uuid],
    queryFn: async () => {
      const { data } = await axios.get<Event>(`/events/${uuid}/itinerary`);
      return data;
    },
    enabled: !!uuid,
  });
};
