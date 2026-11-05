import { Router } from "express";
import { animalController as c } from "./animal.controller";

import { permitirPerfis } from "../../middlewares/autorizar";
export const animalRoutes = Router();
animalRoutes.get("/", c.getAll);
animalRoutes.get("/:id", c.getById);
animalRoutes.post("/", permitirPerfis("ADMIN"), c.create);
animalRoutes.put("/:id", permitirPerfis("ADMIN"), c.update);
animalRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
