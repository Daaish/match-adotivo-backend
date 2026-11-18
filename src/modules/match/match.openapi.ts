import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { json, erro } from "../../utils/openapi.helpers";
import { matchCreateMeSchema } from "./match.schema";

// Os campos e restrições espelham os schemas Zod de execução.
// Datas são documentadas como strings ISO; o schema de execução converte para Temporal.Instant.
const corpoCriacao = z.object({
  id_adotante: z.number().int().positive(),
  id_animal: z.number().int().positive()
}).strict();
const corpoStatus = z.object({ status: z.enum(["PENDENTE", "EM ANDAMENTO", "APROVADO", "CANCELADO"]) }).strict();
const params = z.object({ id: z.coerce.number().int().positive() });
const resposta = z.object({
  id_match: z.number().int(),
  id_adotante: z.number().int(),
  id_animal: z.number().int(),
  data_pedido: z.string(),
  status: z.string()
});

export function registerMatchPaths(registry: OpenAPIRegistry) {
  const prefix = "/matches";
  const tag = "Matches";
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
    responses: { 201: { description: "Cadastro criado", content: json(resposta) }, 400: erro("Dados inválidos"), 404: erro("Relacionamento não encontrado"), 409: erro("Solicitação ativa existente ou animal com adoção aprovada") },
  });
  registry.registerPath({
    method: "post",
    path: `${prefix}/me`,
    tags: [tag],
    summary: "Solicitar adoção como adotante autenticado",
    description: "Exclusivo para ADOTANTE. O vínculo é obtido da conta autenticada. Um match ativo para o mesmo par ou uma adoção aprovada para o animal impede a criação.",
    security: [{ bearerAuth: [] }],
    request: { body: { required: true, content: json(matchCreateMeSchema) } },
    responses: {
      201: { description: "Solicitação criada", content: json(resposta.extend({ status: z.literal("PENDENTE") })) },
      400: erro("Dados inválidos"),
      401: erro("Sessão inválida ou usuário inexistente"),
      403: erro("Perfil sem permissão ou adotante sem vínculo"),
      404: erro("Adotante ou animal não encontrado"),
      409: erro("Solicitação ativa existente ou animal com adoção aprovada"),
      500: erro("Erro interno do servidor"),
    },
  });
  registry.registerPath({
    method: "patch", path: `${prefix}/{id}/status`, tags: [tag], summary: "Alterar status de uma solicitação",
    request: { params, body: { required: true, content: json(corpoStatus) } },
    responses: { 200: { description: "Status atualizado", content: json(resposta) }, 400: erro("Dados inválidos"), 404: erro("Match não encontrado"), 409: erro("Regra de adoção violada") },
  });
  registry.registerPath({
    method: "delete", path: `${prefix}/{id}`, tags: [tag], summary: "Excluir por ID",
    request: { params },
    responses: { 204: { description: "Registro excluído, sem corpo" }, 400: erro("ID inválido"), 404: erro("Registro não encontrado"), 409: erro("Registro vinculado a outros dados") },
  });
}
