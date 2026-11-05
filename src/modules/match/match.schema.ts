import { z } from "zod";
export const matchIdSchema = z.coerce.number().int().positive();
export const matchCreateSchema = z.object({
  id_adotante: z.number().int().positive(),
  id_animal: z.number().int().positive(),
}).strict();
export const matchStatusSchema = z.object({
  status: z.enum(["PENDENTE", "EM ANDAMENTO", "APROVADO", "CANCELADO"]),
}).strict();
