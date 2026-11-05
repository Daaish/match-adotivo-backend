import { z } from "zod";
import { animalCreateSchema, animalUpdateSchema } from "./animal.schema";

export type CreateAnimalDTO = z.infer<typeof animalCreateSchema>;
export type UpdateAnimalDTO = z.infer<typeof animalUpdateSchema>;
