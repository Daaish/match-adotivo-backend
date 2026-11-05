import { z } from "zod";

// Datas no Prisma 8 usam Temporal.Instant (laboratório IV).
const nascimentoSchema = z.iso.date()
  .refine((data) => data <= new Date().toISOString().slice(0, 10), "A data não pode ser futura")
  .transform((data) => Temporal.Instant.from(`${data}T00:00:00Z`));

export const animalCreateSchema = z.object({
  raca: z.string().trim().min(1).max(100).nullable().optional(),
  tipo: z.string().trim().min(1).max(50),
  data_nascimento: nascimentoSchema.nullable().optional(),
  detalhes: z.string().trim().nullable().optional(),
  foto: z.url().max(500).nullable().optional(),
  id_instituicao: z.number().int().positive(),
}).strict();

export const animalUpdateSchema = animalCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualização",
);

export const animalIdSchema = z.coerce.number().int().positive();
