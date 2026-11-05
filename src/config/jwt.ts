import "dotenv/config";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) throw new Error("Defina JWT_SECRET (mínimo de 32 caracteres) no .env");
const invalidated = new Set<string>();

export function generateToken(id: number) {
  return jwt.sign({ id }, secret!, { expiresIn: "1h" });
}
export function verifyToken(token: string): { id: number } {
  if (invalidated.has(token)) throw new UnauthorizedError("Token inválido");
  try {
    const payload = jwt.verify(token, secret!);
    if (typeof payload !== "object" || typeof payload.id !== "number") throw new Error("Payload inválido");
    return { id: payload.id };
  } catch { throw new UnauthorizedError("Token inválido ou expirado"); }
}
export function blacklistToken(token: string) { invalidated.add(token); }
// Segue o laboratório: a blacklist em memória é perdida quando o servidor reinicia.
