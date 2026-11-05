import { instituicaoRepository as repo } from "./instituicao.repo";
import { ConflictError, NotFoundError } from "../../utils/errors";
import type { CreateInstituicaoDTO, UpdateInstituicaoDTO } from "./instituicao.types";

const tratarDuplicado = (error: unknown): never => {
  if (error instanceof Error && error.message === "CNPJ_DUPLICADO") {
    throw new ConflictError("CNPJ já cadastrado");
  }
  throw error;
};
export const instituicaoService = {
  getAll: () => repo.findAll(),
  findById: async (id: number) => {
    const instituicao = await repo.findById(id);
    if (!instituicao) throw new NotFoundError("Instituição não encontrada");
    return instituicao;
  },
  create: async (data: CreateInstituicaoDTO) => {
    if (await repo.findByCnpj(data.cnpj)) throw new ConflictError("CNPJ já cadastrado");
    try { return await repo.create(data); }
    catch (error) { return tratarDuplicado(error); }
  },
  update: async (id: number, data: UpdateInstituicaoDTO) => {
    await instituicaoService.findById(id);
    if (data.cnpj) {
      const existente = await repo.findByCnpj(data.cnpj);
      if (existente && existente.id_instituicao !== id) throw new ConflictError("CNPJ já cadastrado");
    }
    try { return await repo.update(id, data); }
    catch (error) { return tratarDuplicado(error); }
  },
  delete: async (id: number) => {
    await instituicaoService.findById(id);
    return repo.delete(id);
  },
};
