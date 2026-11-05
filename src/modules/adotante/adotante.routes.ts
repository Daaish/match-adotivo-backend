import { Router } from "express";
import { adotanteController as c } from "./adotante.controller";
export const adotanteRoutes = Router();
adotanteRoutes.get("/", c.getAll);
adotanteRoutes.get("/:id", c.getById);
adotanteRoutes.post("/", c.create);
adotanteRoutes.put("/:id", c.update);
adotanteRoutes.delete("/:id", c.remove);
