import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { Event } from "types";

export const useEvent = (uuid: string) => {
  return useQuery({
    queryKey: ["event", uuid],
    queryFn: async () => {
      const { data } = await axios.get<Event>(`/events/${uuid ?? ""}`);
      return data;
    },
    enabled: !!uuid,
  });
};
