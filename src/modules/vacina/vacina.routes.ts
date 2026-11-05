import { Router } from "express";
import { vacinaController as c } from "./vacina.controller";

export const vacinaRoutes = Router();
vacinaRoutes.get("/", c.getAll);
vacinaRoutes.get("/:id", c.getById);
vacinaRoutes.post("/", c.create);
vacinaRoutes.put("/:id", c.update);
vacinaRoutes.delete("/:id", c.remove);
