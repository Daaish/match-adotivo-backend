import { z } from "zod";
export const createUsuarioSchema = z.object({
  nome: z.string().trim().min(3).max(200),
  email: z.email().max(255),
  senha: z.string().min(8).max(128),
}).strict();
export const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
}).strict();
export const usuarioResponseSchema = z.object({
  id: z.number().int(), nome: z.string(), email: z.string(), createdAt: z.iso.datetime()
});
export const tokenResponseSchema = z.object({ token: z.string() });
