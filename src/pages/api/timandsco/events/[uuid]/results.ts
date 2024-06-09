import { setupRouteMethods } from "lib/api/routeMethods";
import { prisma } from "lib/prisma";
import { convertDurationStringToMilliseconds } from "lib/time";
import { NextApiRequest, NextApiResponse } from "next";
import { stageResultsSchema } from "schemas";

const timAndScoEventsUUIDResults = async (req: NextApiRequest, resp: NextApiResponse) =>
  setupRouteMethods({ POST: post }, req, resp);

const post = async (req: NextApiRequest, resp: NextApiResponse) => {
  // make sure they sent valid data over for the stage results
  const body = stageResultsSchema.safeParse(req.body);
  if (!body.success) return resp.status(400).json({ message: "Invalid request" });

  // upsert into the event results table for this event+stage
  const { stageUUID, results } = body.data;

  // can't await inside a forEach
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) continue;

    const time = result.finished ? convertDurationStringToMilliseconds(result.time) : 0;
    await prisma.resultEntry.upsert({
      create: {
        event_result_uuid: stageUUID,
        driver_uuid: result.driverUUID,
        car_uuid: result.carUUID,
        finished: result.finished,
        team_uuid: result.teamUUID,
        time,
      },
      update: {
        car_uuid: result.carUUID,
        finished: result.finished,
        team_uuid: result.teamUUID,
        time,
      },
      where: { resultEntryIdentifier: { driver_uuid: result.driverUUID, event_result_uuid: stageUUID } },
    });
  }

  // TODO: calculate aggregate results

  resp.status(200).end();
};

export default timAndScoEventsUUIDResults;
