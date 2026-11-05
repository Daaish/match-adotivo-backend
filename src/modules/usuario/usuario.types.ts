import type { z } from "zod";
import type { createUsuarioSchema, loginSchema } from "./usuario.schema";
export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
