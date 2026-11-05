import type { Request, Response } from "express";
import { adotanteService as s } from "./adotante.service";
import { adotanteCreateSchema, adotanteUpdateSchema, adotanteIdSchema } from "./adotante.schema";
const id = (req: Request) => adotanteIdSchema.parse(req.params.id);
export const adotanteController = {
  getAll: async (_req: Request, res: Response) => { res.json(await s.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await s.findById(id(req))); },
  create: async (req: Request, res: Response) => { res.status(201).json(await s.create(adotanteCreateSchema.parse(req.body))); },
  update: async (req: Request, res: Response) => { res.json(await s.update(id(req), adotanteUpdateSchema.parse(req.body))); },
  remove: async (req: Request, res: Response) => { await s.delete(id(req)); res.status(204).send(); },
};
