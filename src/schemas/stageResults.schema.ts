import { z } from "zod";

const stageResultEntrySchema = z.object({
  driverUUID: z.string(),
  teamUUID: z.string().optional().nullable(),
  carUUID: z.string(),
  grid: z.number().optional().nullable(),
  finished: z.boolean().default(true),
  laps: z.number().optional().nullable(),
  time: z.string(),
});

export type TIMSCOStageResultEntry = z.infer<typeof stageResultEntrySchema>;

export const stageResultsSchema = z
  .object({
    stageUUID: z.string(),
    results: z.array(stageResultEntrySchema),
  })
  .required();

export type TIMSCOStageResults = z.infer<typeof stageResultsSchema>;
