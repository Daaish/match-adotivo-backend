import type { Request, Response, NextFunction } from "express";
import { db } from "../prisma/db";
import { AppError, UnauthorizedError } from "../utils/errors";

export type Perfil = "ADMIN" | "INSTITUICAO" | "ADOTANTE" | "SEM_PERFIL";

// Executar DEPOIS de autenticar: consulta a permissão atual no banco,
// evitando confiar em um perfil antigo gravado no JWT.
export async function carregarUsuario(_req: Request, res: Response, next: NextFunction) {
  const id = res.locals.usuarioId as number | undefined;
  if (!id) return next(new UnauthorizedError("Autenticação necessária"));
  try {
    const usuario = await db.orm.public.Usuario
      .select("id", "perfil", "id_instituicao", "id_adotante")
      .where({ id }).first();
    if (!usuario) return next(new UnauthorizedError("Usuário não encontrado"));
    res.locals.usuarioAtual = usuario;
    next();
  } catch (err) { next(err); }
}

export function permitirPerfis(...perfis: Perfil[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const usuario = res.locals.usuarioAtual as { perfil?: string } | undefined;
    if (!usuario) return next(new UnauthorizedError("Autenticação necessária"));
    if (!perfis.includes(usuario.perfil as Perfil)) {
      return next(new AppError("Sem permissão para esta operação", 403));
    }
    next();
  };
}
