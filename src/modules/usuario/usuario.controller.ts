import type { Request, Response } from "express";
import { usuarioService } from "./usuario.service";
export const usuarioController = {
  getAll: async (_req: Request, res: Response) => { res.json(await usuarioService.getAll()); },
  create: async (req: Request, res: Response) => { res.status(201).json(await usuarioService.create(req.body)); },
  login: async (req: Request, res: Response) => { res.json(await usuarioService.login(req.body)); },
  logout: ( _req: Request, res: Response) => {
    usuarioService.logout(res.locals.token as string);
    res.json({ message: "Logout realizado com sucesso" });
  },
};
