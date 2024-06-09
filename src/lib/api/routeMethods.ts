import { NextApiRequest, NextApiResponse } from "next";

type RouteMethods = {
  [x: string]: (req: NextApiRequest, resp: NextApiResponse) => Promise<void | NextApiResponse<any>>;
};

export const setupRouteMethods = async (routeMethods: RouteMethods, req: NextApiRequest, resp: NextApiResponse) => {
  try {
    if (req.method && routeMethods[req.method]) return await routeMethods[req.method](req, resp);

    return resp.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("error", error);
    return resp.status(500).json({ message: "Something went wrong, please try again" });
  }
};
