import { z } from "zod";
import { adotanteCreateSchema } from "../adotante/adotante.schema";
import { instituicaoCreateSchema } from "../instituicao/instituicao.schema";

import { createUsuarioSchema } from "./usuario.schema";

export const cadastroAdotanteSchema = z.object({
  usuario: createUsuarioSchema,
  adotante: adotanteCreateSchema,
}).strict();

export const cadastroInstituicaoSchema = z.object({
  usuario: createUsuarioSchema,
  instituicao: instituicaoCreateSchema,
}).strict();

export type CadastroAdotanteDTO = z.infer<typeof cadastroAdotanteSchema>;
export type CadastroInstituicaoDTO = z.infer<typeof cadastroInstituicaoSchema>;
