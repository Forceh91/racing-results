import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import eventsQueryKeys from "./eventsQueryKeys";
import driversQueryKeys from "./driversQueryKeys";

export default mergeQueryKeys(eventsQueryKeys, driversQueryKeys);
