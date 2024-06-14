import { z } from "zod";

export const createCarSchema = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type TIMSCOCreateCar = z.infer<typeof createCarSchema>;
