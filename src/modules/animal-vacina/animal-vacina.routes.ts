import { Router } from "express";
import { animalVacinaController as c } from "./animal-vacina.controller";

import { permitirPerfis } from "../../middlewares/autorizar";
export const animalVacinaRoutes = Router();
animalVacinaRoutes.get("/", c.getAll);
animalVacinaRoutes.get("/:id", c.getById);
animalVacinaRoutes.post("/", permitirPerfis("ADMIN"), c.create);
animalVacinaRoutes.put("/:id", permitirPerfis("ADMIN"), c.update);
animalVacinaRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
