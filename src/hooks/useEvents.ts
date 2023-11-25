import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { EventDetails } from "types";

export const useEvent = (uuid: string) => {
  return useQuery({
    queryKey: ["event", uuid],
    queryFn: async () => {
      const { data } = await axios.get<EventDetails>(`/events/${uuid ?? ""}`);
      return data;
    },
    enabled: !!uuid,
  });
};
