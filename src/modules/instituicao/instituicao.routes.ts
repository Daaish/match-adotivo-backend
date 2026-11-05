import { Router } from "express";
import { instituicaoController as c } from "./instituicao.controller";

import { permitirPerfis } from "../../middlewares/autorizar";
export const instituicaoRoutes = Router();
instituicaoRoutes.get("/", c.getAll);
instituicaoRoutes.get("/:id", c.getById);
instituicaoRoutes.post("/", permitirPerfis("ADMIN"), c.create);
instituicaoRoutes.put("/:id", permitirPerfis("ADMIN"), c.update);
instituicaoRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
