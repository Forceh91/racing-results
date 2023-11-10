import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
  // get event info from db
  return await prisma.event.findMany({
    select: {
      id: false,
      uuid: true,
      name: true,
      start_date: true,
      end_date: true,
      results: { take: 1 },
    },
    take: 20,
    orderBy: {
      start_date: "desc",
    },
  });
};

export default eventsRoute;
