import { z } from "zod";

export const instituicaoCreateSchema = z.object({
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve ter 14 dígitos numéricos"),
  razao_social: z.string().trim().min(1).max(200),
  endereco: z.string().trim().min(1).max(255),
  foto: z.string().url().max(500).optional().nullable(),
}).strict();

export const instituicaoUpdateSchema = instituicaoCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualização",
);
export const instituicaoIdSchema = z.coerce.number().int().positive();
