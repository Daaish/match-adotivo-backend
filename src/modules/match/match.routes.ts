import { Router } from "express";
import { matchController as c } from "./match.controller";
import { permitirPerfis } from "../../middlewares/autorizar";
export const matchRoutes = Router();
matchRoutes.get("/", permitirPerfis("ADMIN"), c.getAll);
matchRoutes.get("/:id", permitirPerfis("ADMIN"), c.getById);
matchRoutes.post("/", permitirPerfis("ADMIN"), c.create);
matchRoutes.patch("/:id/status", permitirPerfis("ADMIN"), c.updateStatus);
matchRoutes.delete("/:id", permitirPerfis("ADMIN"), c.remove);
