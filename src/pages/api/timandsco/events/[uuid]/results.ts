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

  // remove anyone that wasnt in this list
  await prisma.resultEntry.deleteMany({
    where: {
      event_result_uuid: stageUUID,
      driver_uuid: { notIn: results.map((result) => result.driverUUID) },
    },
  });

  // now calculate aggregate results, this has to update all entries for all drivers on this event
  // first fetch all results for all drivers for this event
  const eventUUID = req.query.uuid;
  const allResultsForEvent = await prisma.resultEntry.findMany({
    include: { event_result: true },
    where: { event_result: { event_uuid: eventUUID } },
    orderBy: [{ driver_uuid: "asc" }, { event_result: { event_result_number: "asc" } }],
  });

  // figure out everyones aggregates
  const aggregateTimesPerDriver = allResultsForEvent.reduce((acc, result) => {
    // if the result doesn't have an eventresult entry (impossible?) then skip
    if (!result.event_result) return acc;

    // when we don't have an entry for this driver, create one
    if (!acc[result.driver_uuid]) {
      acc[result.driver_uuid] = [{ time: result.time, event_result_number: result.event_result.event_result_number }];
    } else {
      // otherwise find the previous entry for this driver
      const previousAggregate = acc[result.driver_uuid][acc[result.driver_uuid].length - 1];

      // make sure that the didn't miss an event_result
      if (previousAggregate.event_result_number === result.event_result.event_result_number - 1) {
        // if they didn't finish in the previous event_result, skip this
        if (!previousAggregate.time) return acc;

        // if they finished then add it up, otherwise put them as 0
        if (result.finished) {
          acc[result.driver_uuid].push({
            time: previousAggregate.time + result.time,
            event_result_number: result.event_result.event_result_number,
          });
        } else acc[result.driver_uuid].push({ time: 0, event_result_number: result.event_result.event_result_number });
      }
    }
    return acc;
  }, {} as { [driverUUID: string]: { time: number; event_result_number: number }[] });

  // can't await inside a forEach
  const aggregateTimesPerDriverUUID = Object.keys(aggregateTimesPerDriver);
  for (let j = 0; j < aggregateTimesPerDriverUUID.length; j++) {
    const driverUUID = aggregateTimesPerDriverUUID[j];
    const aggregateTimes = aggregateTimesPerDriver[driverUUID];
    if (!aggregateTimes) continue;

    // now add them all into db doing an upsert
    for (let k = 0; k < aggregateTimes.length; k++) {
      const time = aggregateTimes[k];
      const driverResult = allResultsForEvent.find(
        (result) =>
          result.driver_uuid === driverUUID && result.event_result?.event_result_number === time.event_result_number
      );
      if (!driverResult) continue;

      // update aggregate results
      await prisma.aggreatedResultEntry.upsert({
        create: {
          driver_uuid: driverUUID,
          event_result_number: time.event_result_number,
          time: time.time,
          event_uuid: eventUUID,
          car_uuid: driverResult.car_uuid,
          retired: time.time ? null : true,
        },
        update: { time: time.time, car_uuid: driverResult.car_uuid, retired: time.time ? null : true },
        where: {
          aggregateResultEntryIdentifier: {
            driver_uuid: driverUUID,
            event_uuid: eventUUID,
            event_result_number: time.event_result_number,
          },
        },
      });
    }

    // if they have a stage where they retired (time: 0) or there's a gap, delete the rest
    let ern = 0;
    await prisma.aggreatedResultEntry.deleteMany({
      where: {
        driver_uuid: driverUUID,
        event_uuid: eventUUID,
        event_result_number: {
          notIn: aggregateTimes
            .filter((time, ix) => {
              // remove any retirements
              if (!time.time) return false;

              // remove if theres a gap in event_result_number
              // otherwise increase it and move on
              if (time.event_result_number - 1 !== ern) return false;
              else ern++;

              return true;
            })
            .map((time) => time.event_result_number),
        },
      },
    });
  }

  resp.status(200).end();
};

export default timAndScoEventsUUIDResults;
