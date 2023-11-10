import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
  return resp.json(await getEventInfo(uuid));
};

export const getEventInfo = async (uuid: string) => {
  if (!!!uuid?.length) throw "no uuid provided";

  // get event info from db
  return await prisma.eventResult.findUniqueOrThrow({
    where: { uuid: uuid },
    select: {
      id: false,
      uuid: true,
      circuit: true,
      type: true,
      event_result_number: true,
      results: { include: { driver: true } },
    },
  });
};

export default eventResultUUIDRoute;
