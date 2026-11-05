import { Router } from "express";
import { vacinaController as c } from "./vacina.controller";

import { permitirPerfis } from "../../middlewares/autorizar";
export const vacinaRoutes = Router();
vacinaRoutes.get("/", c.getAll);
vacinaRoutes.get("/:id", c.getById);
vacinaRoutes.post("/", permitirPerfis("ADMIN"), c.create);
vacinaRoutes.put("/:id", permitirPerfis("ADMIN"), c.update);
vacinaRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
