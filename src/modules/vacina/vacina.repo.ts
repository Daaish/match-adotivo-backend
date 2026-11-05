import { db } from "../../prisma/db";
import type { CreateVacinaDTO, UpdateVacinaDTO } from "./vacina.types";

const Vacinas = db.orm.public.Vacina;

export const vacinaRepository = {
  findAll: async () => Vacinas.orderBy((v) => v.id_vacina.asc()).all(),
  findById: async (id: number) => Vacinas.where({ id_vacina: id }).first(),
  create: async (dados: CreateVacinaDTO) => Vacinas.create(dados),
  update: async (id: number, dados: UpdateVacinaDTO) =>
    Vacinas.where({ id_vacina: id }).update(dados),
  delete: async (id: number) => Vacinas.where({ id_vacina: id }).delete(),
};
