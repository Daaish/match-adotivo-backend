import { Router } from "express";
import { instituicaoController as c } from "./instituicao.controller";

export const instituicaoRoutes = Router();
instituicaoRoutes.get("/", c.getAll);
instituicaoRoutes.get("/:id", c.getById);
instituicaoRoutes.post("/", c.create);
instituicaoRoutes.put("/:id", c.update);
instituicaoRoutes.delete("/:id", c.remove);
