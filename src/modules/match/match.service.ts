import { matchRepository as repo } from "./match.repo";
import { animalRepository } from "../animal/animal.repo";
import { AppError, ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateMatchDTO, StatusMatchDTO } from "./match.types";

export type UsuarioAtual = {
  id: number;
  perfil: string;
  id_instituicao: number | null;
  id_adotante: number | null;
};

const proibido = () => new AppError("Sem permissão para esta operação", 403);

function tratarErro(e: unknown): never {
  if ((e as { sqlState?: string })?.sqlState === "23505") {
    throw new ConflictError("Este animal já possui uma adoção aprovada");
  }
  throw e;
}

// Confere a permissão de acesso usando a consulta do animal disponível no fluxo — 18/11/2026.
async function verificarAcesso(
  match: { id_adotante: number; id_animal: number },
  usuario: UsuarioAtual,
  buscarAnimal = animalRepository.findById,
) {
  if (usuario.perfil === "ADMIN") return;
  if (usuario.perfil === "ADOTANTE") {
    if (usuario.id_adotante !== null && usuario.id_adotante === match.id_adotante) return;
    throw proibido();
  }
  if (usuario.perfil === "INSTITUICAO") {
    const animal = await buscarAnimal(match.id_animal);
    if (animal && usuario.id_instituicao !== null && animal.id_instituicao === usuario.id_instituicao) return;
    throw proibido();
  }
  throw proibido();
}

// Valida e cria sob o mesmo bloqueio, independentemente da rota de origem — 18/11/2026.
async function criarSolicitacao(dados: CreateMatchDTO) {
  try {
    // Confere disponibilidade e duplicidade antes da inserção — 18/11/2026.
    return await repo.comBloqueioAnimal(dados.id_animal, async function validarEInserir(consultas) {
      if (!(await consultas.buscarAdotante(dados.id_adotante))) throw new NotFoundError("Adotante não encontrado");
      if (!(await consultas.buscarAnimal())) throw new NotFoundError("Animal não encontrado");
      if (await consultas.buscarAprovado()) throw new ConflictError("Animal já possui adoção aprovada");
      if (await consultas.buscarAtivo(dados.id_adotante)) {
        throw new ConflictError("Já existe uma solicitação ativa para este animal");
      }
      return consultas.criar(dados.id_adotante);
    });
  } catch (erro) {
    tratarErro(erro);
  }
}

export const matchService = {
  getAll: async (usuario: UsuarioAtual) => {
    const matches = await repo.findAll();
    if (usuario.perfil === "ADMIN") return matches;
    if (usuario.perfil === "ADOTANTE") {
      if (usuario.id_adotante === null) throw proibido();
      return matches.filter(m => m.id_adotante === usuario.id_adotante);
    }
    if (usuario.perfil === "INSTITUICAO") {
      if (usuario.id_instituicao === null) throw proibido();
      const animais = await animalRepository.findAll();
      const ids = new Set(animais.filter(a => a.id_instituicao === usuario.id_instituicao).map(a => a.id_animal));
      return matches.filter(m => ids.has(m.id_animal));
    }
    throw proibido();
  },
  findById: async (id: number, usuario: UsuarioAtual) => {
    const match = await repo.findById(id);
    if (!match) throw new NotFoundError("Match não encontrado");
    await verificarAcesso(match, usuario);
    return match;
  },
  // Preserva a autorização e o payload da rota de criação original — 18/11/2026.
  create: async (dados: CreateMatchDTO, usuario: UsuarioAtual) => {
    if (usuario.perfil === "ADOTANTE") {
      if (usuario.id_adotante === null || usuario.id_adotante !== dados.id_adotante) throw proibido();
    } else if (usuario.perfil !== "ADMIN") {
      throw proibido();
    }
    return criarSolicitacao(dados);
  },
  // Deriva o vínculo do adotante antes de usar a criação compartilhada — 18/11/2026.
  criarParaAdotanteAtual: async (idAnimal: number, usuario: UsuarioAtual) => {
    if (usuario.perfil !== "ADOTANTE" || usuario.id_adotante === null) throw proibido();
    return criarSolicitacao({ id_adotante: usuario.id_adotante, id_animal: idAnimal });
  },
  // Valida a transição com o status mais recente e serializa aprovações com criações — 18/11/2026.
  updateStatus: async (id: number, dados: StatusMatchDTO, usuario: UsuarioAtual) => {
    const match = await repo.findById(id);
    if (!match) throw new NotFoundError("Match não encontrado");
    try {
      // Reavalia o acesso e as regras de transição dentro do bloqueio — 18/11/2026.
      return await repo.comBloqueioAnimal(match.id_animal, async function validarEAtualizar(consultas) {
        const atual = await consultas.buscarMatch(id);
        if (!atual) throw new NotFoundError("Match não encontrado");
        await verificarAcesso(atual, usuario, consultas.buscarAnimal);
        if (usuario.perfil === "ADOTANTE") {
          if (dados.status !== "CANCELADO") throw proibido();
        } else if (usuario.perfil !== "INSTITUICAO" && usuario.perfil !== "ADMIN") {
          throw proibido();
        }
        if (atual.status === "APROVADO" && dados.status !== "APROVADO") {
          throw new ConflictError("Uma adoção aprovada não pode ser revertida por esta rota");
        }
        if (atual.status === "CANCELADO" && dados.status !== "CANCELADO") {
          throw new ConflictError("Uma solicitação cancelada não pode ser reaberta");
        }
        if (dados.status === "APROVADO") {
          const aprovado = await consultas.buscarAprovado();
          if (aprovado && aprovado.id_match !== id) throw new ConflictError("Animal já possui adoção aprovada");
        }
        return consultas.atualizarStatus(id, dados);
      });
    } catch (erro) {
      tratarErro(erro);
    }
  },
  // Serializa a exclusão com a aprovação para preservar matches aprovados — 18/11/2026.
  delete: async (id: number, usuario: UsuarioAtual) => {
    if (usuario.perfil !== "ADMIN") throw proibido();
    const match = await repo.findById(id);
    if (!match) throw new NotFoundError("Match não encontrado");
    // Confere o status novamente após adquirir o bloqueio — 18/11/2026.
    return repo.comBloqueioAnimal(match.id_animal, async function validarEExcluir(consultas) {
      const atual = await consultas.buscarMatch(id);
      if (!atual) throw new NotFoundError("Match não encontrado");
      if (atual.status === "APROVADO") throw new ConflictError("Não é permitido excluir uma adoção aprovada");
      return consultas.excluir(id);
    });
  },
};
