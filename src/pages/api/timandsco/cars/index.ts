import { DRIVER_MIN_SEARCH_LENGTH } from "consts";
import { setupRouteMethods } from "lib/api";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const timeAndScoCars = async (req: NextApiRequest, resp: NextApiResponse) =>
  setupRouteMethods({ GET: get, POST: post }, req, resp);

const get = async (req: NextApiRequest, resp: NextApiResponse) => {
  // make sure we got a search query given
  if (typeof req.query.search !== "string" || req.query.search.length < DRIVER_MIN_SEARCH_LENGTH)
    return resp.status(400).json({ message: "Invalid request" });

  const cars = await prisma.car.findMany({
    select: { name: true, uuid: true },
    where: { name: { contains: req.query.search, mode: "insensitive" } },
  });
  resp.status(200).json({ cars });
};

const post = async (req: NextApiRequest, resp: NextApiResponse) => {};

export default timeAndScoCars;
