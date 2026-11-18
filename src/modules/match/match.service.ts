import { matchRepository as repo } from "./match.repo";
import { animalRepository } from "../animal/animal.repo";
import { adotanteRepository } from "../adotante/adotante.repo";
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

async function verificarAcesso(match: { id_adotante: number; id_animal: number }, usuario: UsuarioAtual) {
  if (usuario.perfil === "ADMIN") return;
  if (usuario.perfil === "ADOTANTE") {
    if (usuario.id_adotante !== null && usuario.id_adotante === match.id_adotante) return;
    throw proibido();
  }
  if (usuario.perfil === "INSTITUICAO") {
    const animal = await animalRepository.findById(match.id_animal);
    if (animal && usuario.id_instituicao !== null && animal.id_instituicao === usuario.id_instituicao) return;
    throw proibido();
  }
  throw proibido();
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
  create: async (dados: CreateMatchDTO, usuario: UsuarioAtual) => {
    if (usuario.perfil === "ADOTANTE") {
      if (usuario.id_adotante === null || usuario.id_adotante !== dados.id_adotante) throw proibido();
    } else if (usuario.perfil !== "ADMIN") {
      throw proibido();
    }
    if (!(await adotanteRepository.findById(dados.id_adotante))) throw new NotFoundError("Adotante não encontrado");
    if (!(await animalRepository.findById(dados.id_animal))) throw new NotFoundError("Animal não encontrado");
    if (await repo.findApprovedByAnimal(dados.id_animal)) throw new ConflictError("Animal já possui adoção aprovada");
    try { return await repo.create(dados); } catch (e) { tratarErro(e); }
  },
  updateStatus: async (id: number, dados: StatusMatchDTO, usuario: UsuarioAtual) => {
    const atual = await matchService.findById(id, usuario);
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
      const aprovado = await repo.findApprovedByAnimal(atual.id_animal);
      if (aprovado && aprovado.id_match !== id) throw new ConflictError("Animal já possui adoção aprovada");
    }
    try { return await repo.updateStatus(id, dados); } catch (e) { tratarErro(e); }
  },
  delete: async (id: number, usuario: UsuarioAtual) => {
    if (usuario.perfil !== "ADMIN") throw proibido();
    const atual = await matchService.findById(id, usuario);
    if (atual.status === "APROVADO") throw new ConflictError("Não é permitido excluir uma adoção aprovada");
    return repo.delete(id);
  },
};
