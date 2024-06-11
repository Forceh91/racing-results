import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import eventsQueryKeys from "./eventsQueryKeys";
import driversQueryKeys from "./driversQueryKeys";
import carsQueryKeys from "./carsQueryKeys";

export default mergeQueryKeys(eventsQueryKeys, driversQueryKeys, carsQueryKeys);
