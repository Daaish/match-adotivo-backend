import { Router } from "express";
import { animalVacinaController as c } from "./animal-vacina.controller";

export const animalVacinaRoutes = Router();
animalVacinaRoutes.get("/", c.getAll);
animalVacinaRoutes.get("/:id", c.getById);
animalVacinaRoutes.post("/", c.create);
animalVacinaRoutes.put("/:id", c.update);
animalVacinaRoutes.delete("/:id", c.remove);
