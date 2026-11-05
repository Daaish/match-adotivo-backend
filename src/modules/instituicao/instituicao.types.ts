import { z } from "zod";
import { instituicaoCreateSchema, instituicaoUpdateSchema } from "./instituicao.schema";
export type CreateInstituicaoDTO = z.infer<typeof instituicaoCreateSchema>;
export type UpdateInstituicaoDTO = z.infer<typeof instituicaoUpdateSchema>;
