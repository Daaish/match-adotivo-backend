import { animalRepository as repo } from "./animal.repo";
import { instituicaoRepository } from "../instituicao/instituicao.repo";
import { ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateAnimalDTO, UpdateAnimalDTO } from "./animal.types";

const garantirInstituicao = async (id: number) => {
  if (!(await instituicaoRepository.findById(id))) {
    throw new NotFoundError("Instituição não encontrada");
  }
};

export const animalService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const animal = await repo.findById(id);
    if (!animal) throw new NotFoundError("Animal não encontrado");
    return animal;
  },
  create: async (dados: CreateAnimalDTO) => {
    await garantirInstituicao(dados.id_instituicao);
    return repo.create(dados);
  },
  update: async (id: number, dados: UpdateAnimalDTO) => {
    await animalService.findById(id);
    if (dados.id_instituicao !== undefined) {
      await garantirInstituicao(dados.id_instituicao);
    }
    return repo.update(id, dados);
  },
  delete: async (id: number) => {
    await animalService.findById(id);
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
