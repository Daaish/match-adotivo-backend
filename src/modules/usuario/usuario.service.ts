import bcrypt from "bcrypt";
import { usuarioRepository } from "./usuario.repo";
import { generateToken, blacklistToken } from "../../config/jwt";
import { ConflictError, UnauthorizedError } from "../../utils/errors";
import type { CreateUsuarioDTO, LoginDTO } from "./usuario.types";

export const usuarioService = {
  getAll: () => usuarioRepository.findAll(),
  create: async (data: CreateUsuarioDTO) => {
    if (await usuarioRepository.existsByEmail(data.email)) throw new ConflictError("E-mail já cadastrado");
    return usuarioRepository.create({ ...data, senha: await bcrypt.hash(data.senha, 10) });
  },
  login: async ({ email, senha }: LoginDTO) => {
    const usuario = await usuarioRepository.findByEmailComSenha(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) throw new UnauthorizedError("Credenciais inválidas");
    return { token: generateToken(usuario.id) };
  },
  logout: (token: string) => blacklistToken(token),
};
