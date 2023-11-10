import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { EventOverview } from "types";

export const useEventsOverview = () => {
  return useQuery({
    queryKey: ["eventOverview"],
    queryFn: async () => {
      const { data } = await axios.get<EventOverview[]>("/events");
      return data;
    },
  });
};
