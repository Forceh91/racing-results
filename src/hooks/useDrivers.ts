import { useQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME, DRIVER_MIN_SEARCH_LENGTH } from "consts";
import queryKeys from "queryKeys";

export const useDriversSearchQuery = (searchQuery: string) =>
  useQuery({
    ...queryKeys.drivers.search(searchQuery),
    staleTime: DEFAULT_STALE_TIME,
    enabled: searchQuery?.length >= DRIVER_MIN_SEARCH_LENGTH,
  });

export const useDriverQuery = (driverUUID: string) =>
  useQuery({ ...queryKeys.drivers.detail(driverUUID), staleTime: DEFAULT_STALE_TIME, enabled: !!driverUUID });
