import { z } from "zod";

export const vacinaCreateSchema = z.object({
  nome: z.string().trim().min(1).max(150),
}).strict();

export const vacinaUpdateSchema = vacinaCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualização",
);

export const vacinaIdSchema = z.coerce.number().int().positive();
