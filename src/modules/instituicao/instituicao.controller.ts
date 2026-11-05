import type { Request, Response } from "express";
import { instituicaoService as service } from "./instituicao.service";
import { instituicaoCreateSchema, instituicaoUpdateSchema, instituicaoIdSchema } from "./instituicao.schema";

const lerId = (req: Request) => instituicaoIdSchema.parse(req.params.id);
export const instituicaoController = {
  getAll: async (_req: Request, res: Response) => { res.json(await service.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await service.findById(lerId(req))); },
  create: async (req: Request, res: Response) => {
    const data = instituicaoCreateSchema.parse(req.body);
    res.status(201).json(await service.create(data));
  },
  update: async (req: Request, res: Response) => {
    const data = instituicaoUpdateSchema.parse(req.body);
    res.json(await service.update(lerId(req), data));
  },
  remove: async (req: Request, res: Response) => {
    await service.delete(lerId(req));
    res.status(204).send();
  },
};
