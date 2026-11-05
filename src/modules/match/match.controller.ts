import type { Request, Response } from "express";
import { matchService as s } from "./match.service";
import { matchIdSchema, matchCreateSchema, matchStatusSchema } from "./match.schema";
const id = (req: Request) => matchIdSchema.parse(req.params.id);
export const matchController = {
  getAll: async (_req: Request, res: Response) => { res.json(await s.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await s.findById(id(req))); },
  create: async (req: Request, res: Response) => { res.status(201).json(await s.create(matchCreateSchema.parse(req.body))); },
  updateStatus: async (req: Request, res: Response) => { res.json(await s.updateStatus(id(req), matchStatusSchema.parse(req.body))); },
  remove: async (req: Request, res: Response) => { await s.delete(id(req)); res.status(204).send(); },
};
