import { z } from "zod";
export const json = (schema: z.ZodType) => ({ "application/json": { schema } });
export const erro = (description: string) => ({ description, content: json(z.object({ error: z.string() })) });
