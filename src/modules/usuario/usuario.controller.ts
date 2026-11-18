import type { Request, Response } from "express";
import { AppError } from "../../utils/errors";
import { usuarioAtualResponseSchema } from "./usuario.schema";
import { usuarioService } from "./usuario.service";
export const usuarioController = {
  // Retorna a identidade mínima a partir do usuário carregado do banco — 18/11/2026.
  me: (_req: Request, res: Response) => {
    const usuario = res.locals.usuarioAtual;
    const resultado = usuarioAtualResponseSchema.safeParse({
      id: usuario.id,
      perfil: usuario.perfil,
    });
    if (!resultado.success) throw new AppError("Erro interno do servidor", 500);
    res.status(200).json(resultado.data);
  },
  getAll: async (_req: Request, res: Response) => { res.json(await usuarioService.getAll()); },
  create: async (req: Request, res: Response) => { res.status(201).json(await usuarioService.create(req.body)); },
  login: async (req: Request, res: Response) => { res.json(await usuarioService.login(req.body)); },
  logout: ( _req: Request, res: Response) => {
    usuarioService.logout(res.locals.token as string);
    res.json({ message: "Logout realizado com sucesso" });
  },
};
