import { z } from "zod";
import { animalVacinaCreateSchema, animalVacinaUpdateSchema } from "./animal-vacina.schema";

export type CreateAnimalVacinaDTO = z.infer<typeof animalVacinaCreateSchema>;
export type UpdateAnimalVacinaDTO = z.infer<typeof animalVacinaUpdateSchema>;
