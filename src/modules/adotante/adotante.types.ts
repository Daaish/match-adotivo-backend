import { z } from "zod";
import { adotanteCreateSchema, adotanteUpdateSchema } from "./adotante.schema";
export type CreateAdotanteDTO = z.infer<typeof adotanteCreateSchema>;
export type UpdateAdotanteDTO = z.infer<typeof adotanteUpdateSchema>;
