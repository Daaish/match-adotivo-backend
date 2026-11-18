import type { Request, Response } from "express";
import { animalService as service } from "./animal.service";
import { animalCreateSchema, animalUpdateSchema, animalIdSchema } from "./animal.schema";

const lerId = (req: Request) => animalIdSchema.parse(req.params.id);
type UsuarioAtual = { perfil: string; id_instituicao: number | null };
const usuarioAtual = (res: Response) => res.locals.usuarioAtual as UsuarioAtual;

export const animalController = {
  getAll: async (_req: Request, res: Response) => {
    res.json(await service.getAll());
  },
  getById: async (req: Request, res: Response) => {
    res.json(await service.findById(lerId(req)));
  },
  create: async (req: Request, res: Response) => {
    const dados = animalCreateSchema.parse(req.body);
    res.status(201).json(await service.create(dados, usuarioAtual(res)));
  },
  update: async (req: Request, res: Response) => {
    const dados = animalUpdateSchema.parse(req.body);
    res.json(await service.update(lerId(req), dados, usuarioAtual(res)));
  },
  remove: async (req: Request, res: Response) => {
    await service.delete(lerId(req), usuarioAtual(res));
    res.status(204).send();
  },
};
