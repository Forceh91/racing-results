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
  return resp.json(await getResult(uuid));
};

export const getResult = async (uuid: string) => {
  if (!uuid?.length) throw "no uuid provided";

  // get event info from db
  const result = await prisma.eventResult.findUniqueOrThrow({
    where: { uuid },
    select: {
      id: false,
      uuid: true,
      type: true,
      event_result_number: true,
      circuit: { select: { uuid: true, name: true, length: true } },
      results: {
        select: {
          uuid: true,
          driver: { select: { name: true, nationality: true } },
          team: { select: { name: true } },
          car: true,
          finished: true,
          grid: true,
          laps: true,
          time: true,
        },
      },
      event: { select: { uuid: true, results: { select: { uuid: true, event_result_number: true } } } },
      penalty: {
        select: { driver: { select: { name: true, nationality: true, uuid: true } }, time: true, reason: true },
      },
    },
  });

  // get the aggregate results for this event at this results point in time
  const aggregateResultForEvent = await prisma.aggreatedResultEntry.findMany({
    where: { event_uuid: result.event.uuid, event_result_number: result.event_result_number },
    select: {
      id: false,
      driver: { select: { name: true, nationality: true } },
      car: true,
      time: true,
      event_result_number: true,
    },
    orderBy: [{ time: "asc" }],
  });

  return { ...result, aggregate_results: aggregateResultForEvent };
};

export default eventResultUUIDRoute;
