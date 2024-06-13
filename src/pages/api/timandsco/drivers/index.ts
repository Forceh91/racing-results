import { DRIVER_MIN_SEARCH_LENGTH } from "consts";
import { setupRouteMethods } from "lib/api";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createDriverSchema } from "schemas";

const timeAndScoDrivers = async (req: NextApiRequest, resp: NextApiResponse) =>
  setupRouteMethods({ GET: get, POST: post }, req, resp);

const get = async (req: NextApiRequest, resp: NextApiResponse) => {
  // make sure we got a search query given
  if (typeof req.query.search !== "string" || req.query.search.length < DRIVER_MIN_SEARCH_LENGTH)
    return resp.status(400).json({ message: "Invalid request" });

  const drivers = await prisma.driver.findMany({
    select: { name: true, uuid: true },
    where: { name: { contains: req.query.search, mode: "insensitive" } },
  });
  resp.status(200).json({ drivers });
};

const post = async (req: NextApiRequest, resp: NextApiResponse) => {
  // make sure they sent valid data over for the stage results
  const body = createDriverSchema.safeParse(req.body);
  if (!body.success) return resp.status(400).json({ message: "Invalid request" });

  const driver = await prisma.driver.create({ select: { uuid: true, name: true }, data: { name: body.data.name } });
  resp.status(201).json({ ...driver });
};

export default timeAndScoDrivers;
