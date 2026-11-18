import type { Request, Response } from "express";
import { matchService as s } from "./match.service";
import type { UsuarioAtual } from "./match.service";
import { matchIdSchema, matchCreateSchema, matchCreateMeSchema, matchStatusSchema } from "./match.schema";
const id = (req: Request) => matchIdSchema.parse(req.params.id);
const usuario = (res: Response): UsuarioAtual => res.locals.usuarioAtual as UsuarioAtual;
export const matchController = {
  getAll: async (_req: Request, res: Response) => { res.json(await s.getAll(usuario(res))); },
  getById: async (req: Request, res: Response) => { res.json(await s.findById(id(req), usuario(res))); },
  create: async (req: Request, res: Response) => { res.status(201).json(await s.create(matchCreateSchema.parse(req.body), usuario(res))); },
  // Cria a solicitação para o adotante vinculado à sessão autenticada — 18/11/2026.
  createMe: async (req: Request, res: Response) => {
    const dados = matchCreateMeSchema.parse(req.body);
    const solicitacao = await s.criarParaAdotanteAtual(dados.id_animal, usuario(res));
    res.status(201).json(solicitacao);
  },
  updateStatus: async (req: Request, res: Response) => { res.json(await s.updateStatus(id(req), matchStatusSchema.parse(req.body), usuario(res))); },
  remove: async (req: Request, res: Response) => { await s.delete(id(req), usuario(res)); res.status(204).send(); },
};
