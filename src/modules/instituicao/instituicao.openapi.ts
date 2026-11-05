import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { json, erro } from "../../utils/openapi.helpers";

// Os campos e restrições espelham os schemas Zod de execução.
// Datas são documentadas como strings ISO; o schema de execução converte para Temporal.Instant.
const corpoCriacao = z.object({
  cnpj: z.string().regex(/^\d{14}$/),
  razao_social: z.string().min(1).max(200),
  endereco: z.string().min(1).max(255),
  foto: z.string().url().max(500).nullable().optional()
}).strict();
const corpoAtualizacao = corpoCriacao.partial();
const params = z.object({ id: z.coerce.number().int().positive() });
const resposta = z.object({
  id_instituicao: z.number().int(),
  cnpj: z.string(),
  razao_social: z.string(),
  endereco: z.string(),
  foto: z.string().nullable()
});

export function registerInstituicaoPaths(registry: OpenAPIRegistry) {
  const prefix = "/instituicoes";
  const tag = "Instituições";
  registry.registerPath({
    method: "get", path: prefix, tags: [tag], summary: "Listar registros",
    responses: { 200: { description: "Lista de registros", content: json(z.array(resposta)) } },
  });
  registry.registerPath({
    method: "get", path: `${prefix}/{id}`, tags: [tag], summary: "Buscar por ID",
    request: { params },
    responses: { 200: { description: "Registro encontrado", content: json(resposta) }, 400: erro("ID inválido"), 404: erro("Registro não encontrado") },
  });
  registry.registerPath({
    method: "post", path: prefix, tags: [tag], summary: "Cadastrar",
    request: { body: { required: true, content: json(corpoCriacao) } },
    responses: { 201: { description: "Cadastro criado", content: json(resposta) }, 400: erro("Dados inválidos"), 404: erro("Relacionamento não encontrado"), 409: erro("Conflito ou regra de negócio") },
  });
  registry.registerPath({
    method: "put", path: `${prefix}/{id}`, tags: [tag], summary: "Atualizar cadastro",
    description: "Aceita atualização parcial, exigindo pelo menos um campo.",
    request: { params, body: { required: true, content: json(corpoAtualizacao) } },
    responses: { 200: { description: "Registro atualizado", content: json(resposta) }, 400: erro("Dados inválidos"), 404: erro("Registro não encontrado"), 409: erro("Conflito de dados") },
  });
  registry.registerPath({
    method: "delete", path: `${prefix}/{id}`, tags: [tag], summary: "Excluir por ID",
    request: { params },
    responses: { 204: { description: "Registro excluído, sem corpo" }, 400: erro("ID inválido"), 404: erro("Registro não encontrado"), 409: erro("Registro vinculado a outros dados") },
  });
}
