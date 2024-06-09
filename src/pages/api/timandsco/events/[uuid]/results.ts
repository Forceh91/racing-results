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
  if (!body.success || typeof req.query.uuid !== "string" || !req.query.uuid.length)
    return resp.status(400).json({ message: "Invalid request" });

  // upsert into the event results table for this event+stage
  const { stageUUID, results } = body.data;
  const driverUUIDs = results.map((result) => result.driverUUID);

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

  // now calculate aggregate results, this has to update all entries for all drivers on this event
  // first fetch all results for all drivers for this event
  const eventUUID = req.query.uuid;
  const allResultsForEvent = await prisma.resultEntry.findMany({
    where: { event_result: { event_uuid: eventUUID }, AND: { driver_uuid: { in: driverUUIDs } } },
    orderBy: [{ driver_uuid: "asc" }, { event_result: { event_result_number: "asc" } }],
  });

  console.log("all results", allResultsForEvent);

  // figure out everyones aggregates
  const aggregateTimesPerDriver = allResultsForEvent.reduce((acc, result) => {
    if (!acc[result.driver_uuid]) {
      acc[result.driver_uuid] = [result.time];
    } else {
      const prevTime = acc[result.driver_uuid][acc[result.driver_uuid].length - 1];
      if (result.finished) acc[result.driver_uuid].push(prevTime + result.time);
      else acc[result.driver_uuid].push(0);
    }
    return acc;
  }, {});

  // can't await inside a forEach
  const aggregateTimesPerDriverUUID = Object.keys(aggregateTimesPerDriver);
  for (let j = 0; j < aggregateTimesPerDriverUUID.length; j++) {
    const driverUUID = aggregateTimesPerDriverUUID[j];
    const aggregateTimes = aggregateTimesPerDriver[driverUUID] as number[];
    if (!aggregateTimes) continue;

    // now add them all into db doing an upsert
    for (let k = 0; k < aggregateTimes.length; k++) {
      const time = aggregateTimes[k];
      const driverResult = results.find((result) => result.driverUUID === driverUUID);
      if (!driverResult) continue;

      // TODO: fix the retired state somehow.
      await prisma.aggreatedResultEntry.upsert({
        create: {
          driver_uuid: driverUUID,
          event_result_number: k + 1,
          time: time,
          event_uuid: eventUUID,
          car_uuid: driverResult.carUUID,
          retired: !driverResult.finished,
        },
        update: { time: time, car_uuid: driverResult.carUUID, retired: !driverResult.finished },
        where: {
          aggregateResultEntryIdentifier: {
            driver_uuid: driverUUID,
            event_uuid: eventUUID,
            event_result_number: k + 1,
          },
        },
      });
    }
  }

  // TODO: remove anyone that wasnt in this list
  // await prisma.resultEntry.deleteMany({
  //   where: {
  //     event_result_uuid: stageUUID,
  //     AND: { driver_uuid: { notIn: results.map((result) => result.driverUUID) } },
  //   },
  // });

  resp.status(200).end();
};

export default timAndScoEventsUUIDResults;
