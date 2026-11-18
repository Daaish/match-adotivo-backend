import { z } from "zod";
import { adotanteCreateSchema } from "../adotante/adotante.schema";
import { instituicaoCreateSchema } from "../instituicao/instituicao.schema";

const conta = z.object({
  nome: z.string().trim().min(3).max(200),
  email: z.email().max(255),
  senha: z.string().min(8).max(128),
}).strict();

export const cadastroAdotanteSchema = z.object({
  usuario: conta,
  adotante: adotanteCreateSchema,
}).strict();

export const cadastroInstituicaoSchema = z.object({
  usuario: conta,
  instituicao: instituicaoCreateSchema,
}).strict();

export type CadastroAdotanteDTO = z.infer<typeof cadastroAdotanteSchema>;
export type CadastroInstituicaoDTO = z.infer<typeof cadastroInstituicaoSchema>;
