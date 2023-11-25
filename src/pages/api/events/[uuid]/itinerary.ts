import { EVENT_PRISMA_SELECTOR, EVENT_ITINERARY_PRISMA_SELECTOR } from "consts";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const eventsUUIDItineraryRoute = async (req: NextApiRequest, resp: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        return await eventsUUIDItineraryRouteGET(req, resp);
    }

    return resp.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return resp.status(500).json({ message: (error as Error).message });
  }
};

const eventsUUIDItineraryRouteGET = async (req: NextApiRequest, resp: NextApiResponse) => {
  const { uuid } = (req.query || {}) as { uuid: string };
  return resp.json(await getEventItinerary(uuid));
};

export const getEventItinerary = async (eventUUID: string) => {
  if (!eventUUID?.length) throw "no uuid provided";

  const { aggregated_results, results, ...event } = await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      ...EVENT_PRISMA_SELECTOR,
      results: { select: EVENT_ITINERARY_PRISMA_SELECTOR, orderBy: { event_result_number: "asc" } },
      aggregated_results: { take: 1 },
    },
  });

  return {
    event,
    itinerary: results,
    has_aggregated_results: aggregated_results.length > 0,
    latest_result_uuid: results && results[results.length - 1]?.uuid,
  };
};

export default eventsUUIDItineraryRoute;
