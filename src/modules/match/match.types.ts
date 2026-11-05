import { z } from "zod";
import { matchCreateSchema, matchStatusSchema } from "./match.schema";
export type CreateMatchDTO = z.infer<typeof matchCreateSchema>;
export type StatusMatchDTO = z.infer<typeof matchStatusSchema>;
