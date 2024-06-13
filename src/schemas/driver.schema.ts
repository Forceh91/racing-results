import { z } from "zod";

export const createDriverSchema = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type TIMSCOCreateDriver = z.infer<typeof createDriverSchema>;
