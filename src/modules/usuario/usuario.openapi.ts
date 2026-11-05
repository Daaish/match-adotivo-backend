import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { json, erro } from "../../utils/openapi.helpers";
import { createUsuarioSchema, loginSchema, usuarioResponseSchema, tokenResponseSchema } from "./usuario.schema";
export function registerUsuarioPaths(registry: OpenAPIRegistry) {
  const security = [{ bearerAuth: [] }];
  registry.registerPath({ method: "post", path: "/usuarios", tags: ["Usuários"], summary: "Cadastrar usuário (público)", request: { body: { required: true, content: json(createUsuarioSchema) } }, responses: { 201: { description: "Usuário sem senha", content: json(usuarioResponseSchema) }, 400: erro("Dados inválidos"), 409: erro("E-mail já cadastrado") } });
  registry.registerPath({ method: "post", path: "/usuarios/login", tags: ["Usuários"], summary: "Login (público)", request: { body: { required: true, content: json(loginSchema) } }, responses: { 200: { description: "JWT válido por uma hora", content: json(tokenResponseSchema) }, 401: erro("Credenciais inválidas") } });
  registry.registerPath({ method: "post", path: "/usuarios/logout", tags: ["Usuários"], summary: "Logout", security, responses: { 200: { description: "Token invalidado nesta instância", content: json(z.object({message:z.string()})) }, 401: erro("Token inválido") } });
  registry.registerPath({ method: "get", path: "/usuarios", tags: ["Usuários"], summary: "Listar usuários sem senha", security, responses: { 200: { description: "Usuários", content: json(z.array(usuarioResponseSchema)) }, 401: erro("Token inválido") } });
}
