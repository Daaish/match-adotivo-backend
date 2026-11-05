import { z } from "zod";

const dados = z.object({
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
  nome: z.string().trim().min(1).max(200),
  endereco: z.string().trim().min(1).max(255),
  tipo_residencia: z.enum(["CASA", "APARTAMENTO", "CHÁCARA", "OUTRO"]),
  possui_animais: z.boolean(),
  quantidade_animais: z.number().int().min(0),
  tipos_animais: z.string().trim().nullable().optional(),
}).strict();

function coerencia(d: { possui_animais?: boolean; quantidade_animais?: number }) {
  return d.possui_animais !== false || d.quantidade_animais === 0;
}
export const adotanteCreateSchema = dados.refine(coerencia, {
  message: "Quem não possui animais deve informar quantidade_animais = 0",
  path: ["quantidade_animais"],
});
// Em atualizações parciais, a coerência entre campos será validada no Service.
export const adotanteUpdateSchema = dados.partial().refine(d => Object.keys(d).length > 0, "Informe um campo para atualizar");
export const adotanteIdSchema = z.coerce.number().int().positive();
