import { z } from "zod";

// O contrato Prisma 8 armazena datas como Temporal.Instant.
// O mesmo animal pode receber a mesma vacina em datas diferentes.
const dataAplicacaoSchema = z.iso.date().transform(
  (data) => Temporal.Instant.from(`${data}T00:00:00Z`),
);

export const animalVacinaCreateSchema = z.object({
  id_animal: z.number().int().positive(),
  id_vacina: z.number().int().positive(),
  data_aplicacao: dataAplicacaoSchema,
}).strict();

export const animalVacinaUpdateSchema = animalVacinaCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualização",
);

export const animalVacinaIdSchema = z.coerce.number().int().positive();
