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
  if (!eventUUID?.length) throw "no uuid provided";

  // get event info from db
  const { results, aggregated_results, ...rest } = await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      uuid: true,
      name: true,
      start_date: true,
      end_date: true,
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
      aggregated_results: {
        select: {
          id: false,
          driver: { select: { name: true, nationality: true } },
          car: true,
          time: true,
          event_result_number: true,
          retired: true,
          retired_reason: true,
        },
        orderBy: [{ event_result_number: "desc" }, { time: "asc" }],
      },
    },
  });

  // if we have aggregated results, figure out the highest event_result to display
  const highestAggregateEventResultNumber = aggregated_results.length ? aggregated_results[0].event_result_number : 1;
  const running = aggregated_results.filter(
    (aggregatedResult) =>
      !aggregatedResult.retired && aggregatedResult.event_result_number === highestAggregateEventResultNumber
  );
  const retirements = aggregated_results.filter((aggregatedResult) => aggregatedResult.retired);

  return {
    ...rest,
    results,
    aggregated_results: running,
    retirements,
    event_result_number: highestAggregateEventResultNumber,
  };
};

export default eventsUUIDRoute;
