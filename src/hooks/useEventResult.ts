import { useQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME } from "consts";
import queryKeys from "queryKeys";

export const useEventResultQuery = (uuid: string) =>
  useQuery({ ...queryKeys.events.results(uuid), staleTime: DEFAULT_STALE_TIME, enabled: !!uuid });
