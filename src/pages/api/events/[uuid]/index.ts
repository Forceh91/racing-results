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
  const { results, aggregated_results, ...rest } = await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      uuid: true,
      name: true,
      start_date: true,
      end_date: true,
      results: { select: { id: false, event_result_number: true, uuid: true } },
      aggregated_results: {
        select: { id: false, driver: { select: { name: true } }, car: true, time: true, event_result_number: true },
        orderBy: [{ event_result_number: "desc" }, { time: "asc" }],
      },
    },
  });

  const highestAggregateEventResultNumber = aggregated_results.length ? aggregated_results[0].event_result_number : 1;

  return {
    ...rest,
    results,
    aggregated_results: aggregated_results.filter(
      (aggregatedResult) => aggregatedResult.event_result_number === highestAggregateEventResultNumber
    ),
    event_result_number: highestAggregateEventResultNumber,
  };
};

export default eventsUUIDRoute;
