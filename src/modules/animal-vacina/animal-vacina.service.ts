import { animalVacinaRepository as repo } from "./animal-vacina.repo";
import { animalRepository } from "../animal/animal.repo";
import { vacinaRepository } from "../vacina/vacina.repo";
import { NotFoundError } from "../../utils/errors";
import type { CreateAnimalVacinaDTO, UpdateAnimalVacinaDTO } from "./animal-vacina.types";

async function validarVinculos(dados: { id_animal?: number; id_vacina?: number }) {
  if (dados.id_animal !== undefined && !(await animalRepository.findById(dados.id_animal))) {
    throw new NotFoundError("Animal não encontrado");
  }
  if (dados.id_vacina !== undefined && !(await vacinaRepository.findById(dados.id_vacina))) {
    throw new NotFoundError("Vacina não encontrada");
  }
}

export const animalVacinaService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const aplicacao = await repo.findById(id);
    if (!aplicacao) throw new NotFoundError("Aplicação de vacina não encontrada");
    return aplicacao;
  },
  create: async (dados: CreateAnimalVacinaDTO) => {
    await validarVinculos(dados);
    return repo.create(dados);
  },
  update: async (id: number, dados: UpdateAnimalVacinaDTO) => {
    await animalVacinaService.findById(id);
    await validarVinculos(dados);
    return repo.update(id, dados);
  },
  delete: async (id: number) => {
    await animalVacinaService.findById(id);
    return repo.delete(id);
  },
};
