import { Router } from "express";
import { matchController as c } from "./match.controller";
export const matchRoutes = Router();
matchRoutes.get("/", c.getAll);
matchRoutes.get("/:id", c.getById);
matchRoutes.post("/", c.create);
matchRoutes.patch("/:id/status", c.updateStatus);
matchRoutes.delete("/:id", c.remove);
