import type { Request, Response } from "express";
import { vacinaService as service } from "./vacina.service";
import { vacinaCreateSchema, vacinaUpdateSchema, vacinaIdSchema } from "./vacina.schema";

const lerId = (req: Request) => vacinaIdSchema.parse(req.params.id);

export const vacinaController = {
  getAll: async (_req: Request, res: Response) => {
    res.json(await service.getAll());
  },
  getById: async (req: Request, res: Response) => {
    res.json(await service.findById(lerId(req)));
  },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await service.create(vacinaCreateSchema.parse(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await service.update(lerId(req), vacinaUpdateSchema.parse(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await service.delete(lerId(req));
    res.status(204).send();
  },
};
