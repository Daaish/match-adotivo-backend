import { db } from "../../prisma/db";
import type { CreateInstituicaoDTO, UpdateInstituicaoDTO } from "./instituicao.types";

const Instituicoes = db.orm.public.Instituicao;

const traduzirErro = (error: unknown): never => {
  if ((error as { sqlState?: string }).sqlState === "23505") {
    throw new Error("CNPJ_DUPLICADO");
  }
  throw error;
};

export const instituicaoRepository = {
  findAll: async () => Instituicoes.orderBy((i) => i.id_instituicao.asc()).all(),
  findById: async (id: number) => Instituicoes.where({ id_instituicao: id }).first(),
  findByCnpj: async (cnpj: string) => Instituicoes.where({ cnpj }).first(),
  create: async (data: CreateInstituicaoDTO) => {
    try { return await Instituicoes.create(data); }
    catch (error) { return traduzirErro(error); }
  },
  update: async (id: number, data: UpdateInstituicaoDTO) => {
    try { return await Instituicoes.where({ id_instituicao: id }).update(data); }
    catch (error) { return traduzirErro(error); }
  },
  delete: async (id: number) => Instituicoes.where({ id_instituicao: id }).delete(),
};
