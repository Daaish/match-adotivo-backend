import { animalRepository as repo } from "./animal.repo";
import { matchRepository } from "../match/match.repo";
import { instituicaoRepository } from "../instituicao/instituicao.repo";
import { AppError, ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateAnimalDTO, UpdateAnimalDTO } from "./animal.types";

type UsuarioAtual = {
  perfil: string;
  id_instituicao: number | null;
};

const garantirInstituicao = async (id: number) => {
  if (!(await instituicaoRepository.findById(id))) {
    throw new NotFoundError("Instituição não encontrada");
  }
};

const garantirVinculo = (usuario: UsuarioAtual, idInstituicao: number) => {
  if (usuario.perfil === "ADMIN") return;
  if (
    usuario.perfil !== "INSTITUICAO" ||
    usuario.id_instituicao === null ||
    usuario.id_instituicao !== idInstituicao
  ) {
    throw new AppError("Sem permissão para gerenciar animais desta instituição", 403);
  }
};

export const animalService = {
  // Filtra os animais pela ausência de adoção aprovada em uma consulta em lote — 18/11/2026.
  getAll: async (somenteDisponiveis = false) => {
    const animais = await repo.findAll();
    if (!somenteDisponiveis || animais.length === 0) return animais;

    const aprovados = await matchRepository.listarAnimaisComAdocaoAprovada();
    const idsComAdocao = new Set(aprovados.map(({ id_animal }) => id_animal));
    return animais.filter(({ id_animal }) => !idsComAdocao.has(id_animal));
  },
  // Calcula a disponibilidade de um animal encontrado sem alterar os dados persistidos — 18/11/2026.
  buscarDetalhes: async (id: number) => {
    const animal = await animalService.findById(id);
    const aprovado = await matchRepository.findApprovedByAnimal(animal.id_animal);
    return { ...animal, disponivel: !aprovado };
  },
  findById: async (id: number) => {
    const animal = await repo.findById(id);
    if (!animal) throw new NotFoundError("Animal não encontrado");
    return animal;
  },
  create: async (dados: CreateAnimalDTO, usuario: UsuarioAtual) => {
    garantirVinculo(usuario, dados.id_instituicao);
    await garantirInstituicao(dados.id_instituicao);
    return repo.create(dados);
  },
  update: async (id: number, dados: UpdateAnimalDTO, usuario: UsuarioAtual) => {
    const animal = await animalService.findById(id);
    garantirVinculo(usuario, animal.id_instituicao);
    if (dados.id_instituicao !== undefined) {
      garantirVinculo(usuario, dados.id_instituicao);
      await garantirInstituicao(dados.id_instituicao);
    }
    return repo.update(id, dados);
  },
  delete: async (id: number, usuario: UsuarioAtual) => {
    const animal = await animalService.findById(id);
    garantirVinculo(usuario, animal.id_instituicao);
    try {
      return await repo.delete(id);
    } catch (erro) {
      if ((erro as { sqlState?: string }).sqlState === "23503") {
        throw new ConflictError("Animal possui vacinas ou solicitações vinculadas");
      }
      throw erro;
    }
  },
};
