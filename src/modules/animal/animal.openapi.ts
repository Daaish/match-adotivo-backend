import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { json, erro } from "../../utils/openapi.helpers";

// Os campos e restrições espelham os schemas Zod de execução.
// Datas são documentadas como strings ISO; o schema de execução converte para Temporal.Instant.
const corpoCriacao = z.object({
  raca: z.string().min(1).max(100).nullable().optional(),
  tipo: z.string().min(1).max(50),
  data_nascimento: z.iso.date().nullable().optional(),
  detalhes: z.string().nullable().optional(),
  foto: z.string().url().max(500).nullable().optional(),
  id_instituicao: z.number().int().positive()
}).strict();
const corpoAtualizacao = corpoCriacao.partial();
const params = z.object({ id: z.coerce.number().int().positive() });
const resposta = z.object({
  id_animal: z.number().int(),
  raca: z.string().nullable(),
  tipo: z.string(),
  data_nascimento: z.string().nullable(),
  detalhes: z.string().nullable(),
  foto: z.string().nullable(),
  id_instituicao: z.number().int()
});

export function registerAnimalPaths(registry: OpenAPIRegistry) {
  const prefix = "/animais";
  const tag = "Animais";
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
