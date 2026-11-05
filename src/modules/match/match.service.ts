import { matchRepository as repo } from "./match.repo";
import { animalRepository } from "../animal/animal.repo";
import { adotanteRepository } from "../adotante/adotante.repo";
import { ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateMatchDTO, StatusMatchDTO } from "./match.types";
function tratarErro(e: unknown): never {
  if ((e as {sqlState?: string})?.sqlState === "23505") {
    throw new ConflictError("Este animal já possui uma adoção aprovada");
  }
  throw e;
}
export const matchService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const match = await repo.findById(id);
    if (!match) throw new NotFoundError("Match não encontrado");
    return match;
  },
  create: async (dados: CreateMatchDTO) => {
    if (!(await adotanteRepository.findById(dados.id_adotante))) throw new NotFoundError("Adotante não encontrado");
    if (!(await animalRepository.findById(dados.id_animal))) throw new NotFoundError("Animal não encontrado");
    if (await repo.findApprovedByAnimal(dados.id_animal)) throw new ConflictError("Animal já possui adoção aprovada");
    try { return await repo.create(dados); } catch (e) { tratarErro(e); }
  },
  updateStatus: async (id: number, dados: StatusMatchDTO) => {
    const atual = await matchService.findById(id);
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
    try { return await repo.updateStatus(id, dados); } catch(e) { tratarErro(e); }
  },
  delete: async (id: number) => {
    const atual = await matchService.findById(id);
    if (atual.status === "APROVADO") throw new ConflictError("Não é permitido excluir uma adoção aprovada");
    return repo.delete(id);
  },
};
