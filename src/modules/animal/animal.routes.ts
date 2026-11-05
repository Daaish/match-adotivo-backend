import { Router } from "express";
import { animalController as c } from "./animal.controller";

export const animalRoutes = Router();
animalRoutes.get("/", c.getAll);
animalRoutes.get("/:id", c.getById);
animalRoutes.post("/", c.create);
animalRoutes.put("/:id", c.update);
animalRoutes.delete("/:id", c.remove);
