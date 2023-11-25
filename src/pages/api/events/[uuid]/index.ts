import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { EVENT_PRISMA_SELECTOR, EVENT_AGGREGATED_RESULTS_ENTRY_PRISMA_SELECTOR } from "consts";

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
  const { results, aggregated_results, ...event } = await prisma.event.findUniqueOrThrow({
    where: { uuid: eventUUID },
    select: {
      ...EVENT_PRISMA_SELECTOR,
      aggregated_results: {
        select: { ...EVENT_AGGREGATED_RESULTS_ENTRY_PRISMA_SELECTOR },
        orderBy: [{ event_result_number: "desc" }, { time: "asc" }],
      },
      results: { select: { uuid: true }, take: 1, orderBy: { event_result_number: "desc" } },
    },
  });

  // if we have aggregated results, figure out the highest event_result to display
  const highestAggregateEventResultNumber = aggregated_results.length ? aggregated_results[0].event_result_number : 1;
  const running = aggregated_results.filter(
    (aggregatedResult) =>
      !aggregatedResult.retired && aggregatedResult.event_result_number === highestAggregateEventResultNumber
  );
  const retirements = aggregated_results.filter((aggregatedResult) => aggregatedResult.retired);
  const lastResultUUID = results[0]?.uuid ?? "";

  return {
    ...event,
    aggregated_results: running,
    retirements,
    last_event_result_number: highestAggregateEventResultNumber,
    last_result_uuid: lastResultUUID,
  };
};

export default eventsUUIDRoute;
