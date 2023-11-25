import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import {
  EVENT_PRISMA_SELECTOR,
  CIRCUIT_PRISMA_SELECTOR,
  DRIVER_PRISMA_SELECTOR,
  TEAM_PRISMA_SELECTOR,
  EVENT_ITINERARY_LIGHT_PRISMA_SELECTOR,
} from "consts";

const eventResultUUIDRoute = async (req: NextApiRequest, resp: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        return await eventResultUUIDRouteGET(req, resp);
    }

    return resp.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return resp.status(500).json({ message: (error as Error).message });
  }
};

const eventResultUUIDRouteGET = async (req: NextApiRequest, resp: NextApiResponse) => {
  const { uuid } = (req.query || {}) as { uuid: string };
  return resp.json(await getResult(uuid));
};

export const getResult = async (uuid: string) => {
  if (!uuid?.length) throw "no uuid provided";

  // get event info from db
  const { event, results, penalty, ...result } = await prisma.eventResult.findUniqueOrThrow({
    where: { uuid },
    select: {
      uuid: true,
      type: true,
      event_result_number: true,
      circuit: { select: CIRCUIT_PRISMA_SELECTOR },
      results: {
        select: {
          uuid: true,
          driver: { select: DRIVER_PRISMA_SELECTOR },
          team: { select: TEAM_PRISMA_SELECTOR },
          car: true,
          finished: true,
          grid: true,
          laps: true,
          time: true,
        },
      },
      event: {
        select: {
          ...EVENT_PRISMA_SELECTOR,
          results: { select: EVENT_ITINERARY_LIGHT_PRISMA_SELECTOR, orderBy: { event_result_number: "asc" } },
        },
      },
      penalty: {
        select: { driver: { select: DRIVER_PRISMA_SELECTOR }, time: true, reason: true },
      },
    },
  });

  // get the aggregate results for this event at this results point in time
  const aggregateResultForEvent = await prisma.aggreatedResultEntry.findMany({
    where: {
      event_uuid: event.uuid,
      event_result_number: result.event_result_number,
      retired: { equals: null },
    },
    select: {
      id: false,
      driver: { select: { name: true, nationality: true } },
      car: true,
      time: true,
      event_result_number: true,
    },
    orderBy: [{ time: "asc" }],
  });

  const { results: itinerary, ...eventDetails } = event;

  return {
    ...result,
    event: eventDetails,
    results,
    aggregated_results: aggregateResultForEvent,
    penalties: penalty,
    itinerary,
  };
};

export default eventResultUUIDRoute;
