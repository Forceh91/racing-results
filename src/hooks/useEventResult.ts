import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { EventResult } from "types";

export const useEventResult = (uuid: string) => {
  return useQuery({
    queryKey: ["eventResult", uuid],
    queryFn: async () => {
      const { data } = await axios.get<EventResult>(`/results/${uuid ?? ""}`);
      return data;
    },
    enabled: !!uuid,
  });
};
