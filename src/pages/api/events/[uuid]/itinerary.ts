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

  // get event info from db
  return await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      uuid: true,
      name: true,
      results: {
        select: {
          id: false,
          leg: true,
          event_result_number: true,
          type: true,
          uuid: true,
          circuit: { select: { name: true, length: true } },
        },
      },
    },
  });
};

export default eventsUUIDItineraryRoute;
