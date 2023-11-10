import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const eventsUUIDRoute = async (req: NextApiRequest, resp: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        return await eventsUUIDRouteGET(req, resp);
    }

    return resp.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return resp.status(500).json({ message: (error as Error).message });
  }
};

const eventsUUIDRouteGET = async (req: NextApiRequest, resp: NextApiResponse) => {
  const { uuid } = (req.query || {}) as { uuid: string };
  return resp.json(await getEventInfo(uuid));
};

export const getEventInfo = async (eventUUID: string) => {
  if (!!!eventUUID?.length) throw "no uuid provided";

  // get event info from db
  return await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      id: false,
      uuid: true,
      name: true,
      start_date: true,
      end_date: true,
      results: true,
      aggregated_results: true,
    },
  });
};

export default eventsUUIDRoute;
