import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { DRIVER_PRISMA_SELECTOR, EVENT_PRISMA_SELECTOR } from "consts";
import { isPast } from "date-fns";

const eventsRoute = async (req: NextApiRequest, resp: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        return await eventsRouteGET(req, resp);
    }

    return resp.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return resp.status(500).json({ message: (error as Error).message });
  }
};

const eventsRouteGET = async (req: NextApiRequest, resp: NextApiResponse) => {
  return resp.json(await getRecentEvents());
};

export const getRecentEvents = async () => {
  // get 20 most recent events from the db
  const events = await prisma.event.findMany({
    select: {
      ...EVENT_PRISMA_SELECTOR,
      results: { take: 1 },
      aggregated_results: {
        select: { driver: { select: DRIVER_PRISMA_SELECTOR }, event_result_number: true },
        orderBy: [{ event_result_number: "desc" }, { time: "asc" }],
        take: 1,
        where: { retired: null },
      },
      _count: { select: { results: true } },
    },
    take: 20,
    orderBy: { start_date: "desc" },
  });

  return events.map((event) => {
    const { results, aggregated_results, ...rest } = event;
    return {
      has_itinerary: !!results,
      winner:
        aggregated_results?.length > 0 &&
        ((event.end_date && isPast(event.end_date)) ||
          aggregated_results[0].event_result_number === event._count.results)
          ? aggregated_results[0].driver
          : null,
      ...rest,
    };
  });
};

export default eventsRoute;
