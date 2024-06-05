import { useQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME } from "consts";
import queryKeys from "queryKeys";

export const useEventQuery = (uuid: string) =>
  useQuery({ ...queryKeys.events.detail(uuid), staleTime: DEFAULT_STALE_TIME, enabled: !!uuid });
