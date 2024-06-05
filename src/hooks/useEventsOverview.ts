import { useQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME } from "consts";
import queryKeys from "queryKeys";

export const useEventsOverviewQuery = () => useQuery({ ...queryKeys.events.all, staleTime: DEFAULT_STALE_TIME });
