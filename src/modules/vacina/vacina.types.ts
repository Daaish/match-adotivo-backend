import { z } from "zod";
import { vacinaCreateSchema, vacinaUpdateSchema } from "./vacina.schema";

export type CreateVacinaDTO = z.infer<typeof vacinaCreateSchema>;
export type UpdateVacinaDTO = z.infer<typeof vacinaUpdateSchema>;
