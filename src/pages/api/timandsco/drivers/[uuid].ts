import { DRIVER_MIN_SEARCH_LENGTH } from "consts";
import { setupRouteMethods } from "lib/api";
import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const timeAndScoDriverUUID = async (req: NextApiRequest, resp: NextApiResponse) =>
  setupRouteMethods({ GET: get }, req, resp);

const get = async (req: NextApiRequest, resp: NextApiResponse) => {
  // make sure we got a search query given
  if (typeof req.query.uuid !== "string" || req.query.uuid.length < DRIVER_MIN_SEARCH_LENGTH)
    return resp.status(400).json({ message: "Invalid request" });

  const driver = await prisma.driver.findUnique({
    select: { name: true, uuid: true },
    where: { uuid: req.query.uuid },
  });
  resp.status(200).json({ ...driver });
};

export default timeAndScoDriverUUID;
