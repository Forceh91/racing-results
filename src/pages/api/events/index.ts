import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { EVENT_PRISMA_SELECTOR } from "consts";

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
    select: { ...EVENT_PRISMA_SELECTOR, results: { take: 1 } },
    take: 20,
    orderBy: { start_date: "desc" },
  });

  return events.map((event) => {
    const { results, ...rest } = event;
    return { has_itinerary: !!results, ...rest };
  });
};

export default eventsRoute;
