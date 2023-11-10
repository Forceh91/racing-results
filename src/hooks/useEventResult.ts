import { useQuery } from "@tanstack/react-query";
import axios from "lib/axios";
import { Result } from "types";

export const useEventResult = (uuid: string) => {
  return useQuery({
    queryKey: ["eventResult", uuid],
    queryFn: async () => {
      const { data } = await axios.get<Result>(`/results/${uuid ?? ""}`);
      return data;
    },
    enabled: !!uuid,
  });
};
