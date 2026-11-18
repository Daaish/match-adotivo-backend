import { db } from "../../prisma/db";
import { ConflictError } from "../../utils/errors";
import type { CadastroAdotanteDTO, CadastroInstituicaoDTO } from "./cadastro-perfil.schema";

function traduzirErro(error: unknown): never {
  // PostgreSQL: violação de UNIQUE (e-mail, CPF ou CNPJ).
  if ((error as { sqlState?: string }).sqlState === "23505") {
    throw new ConflictError("E-mail, CPF ou CNPJ já cadastrado");
  }
  throw error;
}

export const cadastroPerfilRepository = {
  async adotante(dados: CadastroAdotanteDTO, senhaHash: string) {
    try {
      return await db.transaction(async (tx) => {
        const adotante = await tx.orm.public.Adotante.create(dados.adotante);
        const usuario = await tx.orm.public.Usuario.create({
          nome: dados.usuario.nome,
          email: dados.usuario.email,
          senha: senhaHash,
          perfil: "ADOTANTE",
          id_adotante: adotante.id_adotante,
        });
        return {
          usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
          adotante: { id_adotante: adotante.id_adotante },
        };
      });
    } catch (error) { return traduzirErro(error); }
  },

  async instituicao(dados: CadastroInstituicaoDTO, senhaHash: string) {
    try {
      return await db.transaction(async (tx) => {
        const instituicao = await tx.orm.public.Instituicao.create(dados.instituicao);
        const usuario = await tx.orm.public.Usuario.create({
          nome: dados.usuario.nome,
          email: dados.usuario.email,
          senha: senhaHash,
          perfil: "INSTITUICAO",
          id_instituicao: instituicao.id_instituicao,
        });
        return {
          usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
          instituicao: { id_instituicao: instituicao.id_instituicao },
        };
      });
    } catch (error) { return traduzirErro(error); }
  },
};
