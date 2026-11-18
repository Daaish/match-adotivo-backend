import { Router, type RequestHandler } from "express";
import { usuarioController as c } from "./usuario.controller";
import { validate } from "../../middlewares/validate";
import { autenticar } from "../../middlewares/autenticar";
import { carregarUsuario, permitirPerfis } from "../../middlewares/autorizar";
import { createUsuarioSchema, loginSchema } from "./usuario.schema";
import { cadastroPerfilController } from "./cadastro-perfil.controller";
import {
  cadastroAdotanteSchema,
  cadastroInstituicaoSchema
} from "./cadastro-perfil.schema";
// Impede cache da consulta de sessão, inclusive quando a autenticação falha — 18/11/2026.
const desabilitarCache: RequestHandler = (_req, res, proximo) => {
  res.set("Cache-Control", "no-store");
  proximo();
};

export const usuarioRoutes = Router();
usuarioRoutes.get("/me", desabilitarCache, autenticar, carregarUsuario, c.me);
usuarioRoutes.post(
  "/cadastro-adotante",
  validate(cadastroAdotanteSchema),
  cadastroPerfilController.adotante
);

usuarioRoutes.post(
  "/cadastro-instituicao",
  validate(cadastroInstituicaoSchema),
  cadastroPerfilController.instituicao
);
usuarioRoutes.post("/", validate(createUsuarioSchema), c.create);
usuarioRoutes.post("/login", validate(loginSchema), c.login);
usuarioRoutes.post("/logout", autenticar, c.logout);
usuarioRoutes.get("/", autenticar, carregarUsuario, permitirPerfis("ADMIN"), c.getAll);
