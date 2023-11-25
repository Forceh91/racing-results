import { DRIVER_PRISMA_SELECTOR } from "./driver.consts";
import { CIRCUIT_PRISMA_SELECTOR } from "./circuit.consts";

export const EVENT_PRISMA_SELECTOR = { uuid: true, name: true, start_date: true, end_date: true };
export const EVENT_AGGREGATED_RESULTS_ENTRY_PRISMA_SELECTOR = {
  driver: { select: { ...DRIVER_PRISMA_SELECTOR } },
  car: true,
  event_result_number: true,
  time: true,
  retired: true,
  retired_reason: true,
};

export const EVENT_ITINERARY_LIGHT_PRISMA_SELECTOR = {
  uuid: true,
  type: true,
  event_result_number: true,
  leg: true,
};

export const EVENT_ITINERARY_PRISMA_SELECTOR = {
  ...EVENT_ITINERARY_LIGHT_PRISMA_SELECTOR,
  circuit: { select: CIRCUIT_PRISMA_SELECTOR },
};
