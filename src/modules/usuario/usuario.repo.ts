import { db } from "../../prisma/db";
import { ConflictError } from "../../utils/errors";
import type { CreateUsuarioDTO } from "./usuario.types";

const Usuarios = db.orm.public.Usuario;
const Publicos = Usuarios.select("id", "nome", "email", "createdAt");
const traduzirErro = (err: unknown): never => {
  if ((err as { sqlState?: string }).sqlState === "23505") throw new ConflictError("E-mail já cadastrado");
  throw err;
};
export const usuarioRepository = {
  findAll: async () => Publicos.orderBy(u => u.id.asc()).all(),
  findByEmailComSenha: async (email: string) => Usuarios.where({ email }).first(),
  existsByEmail: async (email: string) => (await Usuarios.select("id").where({ email }).first()) !== null,
  create: async (data: CreateUsuarioDTO) => {
    try { return await Publicos.create(data); }
    catch (err) { return traduzirErro(err); }
  },
};
