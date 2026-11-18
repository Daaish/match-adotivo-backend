import type { Request, Response } from "express";
import { cadastroPerfilService } from "./cadastro-perfil.service";

export const cadastroPerfilController = {
  async adotante(req: Request, res: Response) {
    res.status(201).json(await cadastroPerfilService.adotante(req.body));
  },
  async instituicao(req: Request, res: Response) {
    res.status(201).json(await cadastroPerfilService.instituicao(req.body));
  },
};
