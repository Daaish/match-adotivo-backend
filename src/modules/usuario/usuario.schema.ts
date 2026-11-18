import { z } from "zod";
export const createUsuarioSchema = z.object({
  nome: z.string().trim().min(3).max(200),
  email: z.email().max(255),
  // Limita a senha nova ao tamanho efetivamente usado pelo bcrypt — 18/11/2026.
  senha: z.string().min(8).refine(function cabeNoBcrypt(senha) {
    return Buffer.byteLength(senha, "utf8") <= 72;
  }, "A senha deve ter até 72 bytes em UTF-8"),
}).strict();
export const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
}).strict();
export const usuarioResponseSchema = z.object({
  id: z.number().int(), nome: z.string(), email: z.string(), createdAt: z.iso.datetime()
});
export const usuarioAtualResponseSchema = z.discriminatedUnion("perfil", [
  z.object({
    id: z.number().int(),
    perfil: z.literal("INSTITUICAO"),
    id_instituicao: z.number().int().positive().nullable(),
  }),
  z.object({
    id: z.number().int(),
    perfil: z.enum(["ADMIN", "ADOTANTE", "SEM_PERFIL"]),
  }),
]);
export const tokenResponseSchema = z.object({ token: z.string() });
