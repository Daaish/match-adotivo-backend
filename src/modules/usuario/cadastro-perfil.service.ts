import bcrypt from "bcrypt";
import { validarCoerencia } from "../adotante/adotante.service";
import { cadastroPerfilRepository } from "./cadastro-perfil.repo";
import type { CadastroAdotanteDTO, CadastroInstituicaoDTO } from "./cadastro-perfil.schema";

export const cadastroPerfilService = {
  // Confere a quantidade informada antes de gerar o hash ou gravar o cadastro — 18/11/2026.
  async adotante(dados: CadastroAdotanteDTO) {
    validarCoerencia(dados.adotante);
    const hash = await bcrypt.hash(dados.usuario.senha, 10);
    return cadastroPerfilRepository.adotante(dados, hash);
  },
  async instituicao(dados: CadastroInstituicaoDTO) {
    const hash = await bcrypt.hash(dados.usuario.senha, 10);
    return cadastroPerfilRepository.instituicao(dados, hash);
  },
};
