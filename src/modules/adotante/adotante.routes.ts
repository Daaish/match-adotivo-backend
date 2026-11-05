import { Router } from "express";
import { adotanteController as c } from "./adotante.controller";
import { permitirPerfis } from "../../middlewares/autorizar";
export const adotanteRoutes = Router();
adotanteRoutes.get("/", permitirPerfis("ADMIN"), c.getAll);
adotanteRoutes.get("/:id", permitirPerfis("ADMIN"), c.getById);
adotanteRoutes.post("/", permitirPerfis("ADMIN"), c.create);
adotanteRoutes.put("/:id", permitirPerfis("ADMIN"), c.update);
adotanteRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
