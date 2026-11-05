import type { Request, Response } from "express";
import { animalVacinaService as service } from "./animal-vacina.service";
import { animalVacinaCreateSchema, animalVacinaUpdateSchema, animalVacinaIdSchema } from "./animal-vacina.schema";

const lerId = (req: Request) => animalVacinaIdSchema.parse(req.params.id);

export const animalVacinaController = {
  getAll: async (_req: Request, res: Response) => {
    res.json(await service.getAll());
  },
  getById: async (req: Request, res: Response) => {
    res.json(await service.findById(lerId(req)));
  },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await service.create(animalVacinaCreateSchema.parse(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await service.update(lerId(req), animalVacinaUpdateSchema.parse(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await service.delete(lerId(req));
    res.status(204).send();
  },
};
