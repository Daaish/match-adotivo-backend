import bcrypt from "bcrypt";
import { cadastroPerfilRepository } from "./cadastro-perfil.repo";
import type { CadastroAdotanteDTO, CadastroInstituicaoDTO } from "./cadastro-perfil.schema";

export const cadastroPerfilService = {
  async adotante(dados: CadastroAdotanteDTO) {
    const hash = await bcrypt.hash(dados.usuario.senha, 10);
    return cadastroPerfilRepository.adotante(dados, hash);
  },
  async instituicao(dados: CadastroInstituicaoDTO) {
    const hash = await bcrypt.hash(dados.usuario.senha, 10);
    return cadastroPerfilRepository.instituicao(dados, hash);
  },
};
