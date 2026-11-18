import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { json, erro } from "../../utils/openapi.helpers";
import { createUsuarioSchema, loginSchema, usuarioResponseSchema, tokenResponseSchema, usuarioAtualResponseSchema } from "./usuario.schema";
import {
  cadastroAdotanteSchema,
  cadastroInstituicaoSchema,
} from "./cadastro-perfil.schema";
export function registerUsuarioPaths(registry: OpenAPIRegistry) {
  const security = [{ bearerAuth: [] }];
  const cabecalhosUsuarioAtual = {
    "Cache-Control": { schema: { type: "string" as const, enum: ["no-store"] } },
  };
  registry.registerPath({
    method: "get",
    path: "/usuarios/me",
    tags: ["Usuários"],
    summary: "Consultar o perfil atual do usuário autenticado",
    security,
    responses: {
      200: {
        description: "Identificador e perfil atual do usuário",
        headers: cabecalhosUsuarioAtual,
        content: json(usuarioAtualResponseSchema),
      },
      401: {
        ...erro("Sessão inválida ou usuário inexistente"),
        headers: cabecalhosUsuarioAtual,
      },
    },
  });
  registry.registerPath({ method: "post", path: "/usuarios", tags: ["Usuários"], summary: "Cadastrar usuário (público)", request: { body: { required: true, content: json(createUsuarioSchema) } }, responses: { 201: { description: "Usuário sem senha", content: json(usuarioResponseSchema) }, 400: erro("Dados inválidos"), 409: erro("E-mail já cadastrado") } });
  registry.registerPath({ method: "post", path: "/usuarios/login", tags: ["Usuários"], summary: "Login (público)", request: { body: { required: true, content: json(loginSchema) } }, responses: { 200: { description: "JWT válido por uma hora", content: json(tokenResponseSchema) }, 401: erro("Credenciais inválidas") } });
  registry.registerPath({ method: "post", path: "/usuarios/logout", tags: ["Usuários"], summary: "Logout", security, responses: { 200: { description: "Token invalidado nesta instância", content: json(z.object({message:z.string()})) }, 401: erro("Token inválido") } });
  registry.registerPath({ method: "get", path: "/usuarios", tags: ["Usuários"], summary: "Listar usuários sem senha", security, responses: { 200: { description: "Usuários", content: json(z.array(usuarioResponseSchema)) }, 401: erro("Token inválido") } });
    registry.registerPath({
    method: "post",
    path: "/usuarios/cadastro-adotante",
    tags: ["Usuários"],
    summary: "Cadastro automático de adotante (público)",
    request: {
      body: {
        required: true,
        content: json(cadastroAdotanteSchema),
      },
    },
    responses: {
      201: { description: "Usuário e perfil de adotante criados" },
      400: erro("Dados inválidos"),
      409: erro("E-mail ou CPF já cadastrado"),
    },
  });

  registry.registerPath({
    method: "post",
    path: "/usuarios/cadastro-instituicao",
    tags: ["Usuários"],
    summary: "Cadastro automático de instituição (público)",
    request: {
      body: {
        required: true,
        content: json(cadastroInstituicaoSchema),
      },
    },
    responses: {
      201: { description: "Usuário e instituição criados" },
      400: erro("Dados inválidos"),
      409: erro("E-mail ou CNPJ já cadastrado"),
    },
  });
}
