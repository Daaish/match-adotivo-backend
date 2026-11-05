import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
export const validate = (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  req.body = schema.parse(req.body);
  next();
};
