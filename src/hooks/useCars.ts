import { useQuery } from "@tanstack/react-query";
import { CAR_MIN_SEARCH_LENGTH, DEFAULT_STALE_TIME } from "consts";
import queryKeys from "queryKeys";

export const useCarsSearchQuery = (searchQuery: string) =>
  useQuery({
    ...queryKeys.cars.search(searchQuery),
    staleTime: DEFAULT_STALE_TIME,
    enabled: searchQuery?.length >= CAR_MIN_SEARCH_LENGTH,
  });

export const useCarQuery = (carUUID: string) =>
  useQuery({ ...queryKeys.drivers.detail(carUUID), staleTime: DEFAULT_STALE_TIME, enabled: !!carUUID });
