import { vacinaRepository as repo } from "./vacina.repo";
import { NotFoundError } from "../../utils/errors";
import type { CreateVacinaDTO, UpdateVacinaDTO } from "./vacina.types";

export const vacinaService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const vacina = await repo.findById(id);
    if (!vacina) throw new NotFoundError("Vacina não encontrada");
    return vacina;
  },
  create: (dados: CreateVacinaDTO) => repo.create(dados),
  update: async (id: number, dados: UpdateVacinaDTO) => {
    await vacinaService.findById(id);
    return repo.update(id, dados);
  },
  delete: async (id: number) => {
    await vacinaService.findById(id);
    return repo.delete(id);
  },
};
