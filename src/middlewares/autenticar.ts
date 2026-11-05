import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { UnauthorizedError } from "../utils/errors";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const [kind, token, extra] = req.headers.authorization?.split(" ") ?? [];
  if (kind !== "Bearer" || !token || extra) throw new UnauthorizedError("Token não informado");
  const payload = verifyToken(token);
  res.locals.usuarioId = payload.id;
  res.locals.token = token;
  next();
}
