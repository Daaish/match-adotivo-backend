import { db } from "../../prisma/db";
import type { CreateAdotanteDTO, UpdateAdotanteDTO } from "./adotante.types";
const Adotantes = db.orm.public.Adotante;
export const adotanteRepository = {
  findAll: () => Adotantes.orderBy(a => a.id_adotante.asc()).all(),
  findById: (id: number) => Adotantes.where({ id_adotante: id }).first(),
  findByCpf: (cpf: string) => Adotantes.where({ cpf }).first(),
  create: (dados: CreateAdotanteDTO) => Adotantes.create(dados),
  update: (id: number, dados: UpdateAdotanteDTO) => Adotantes.where({ id_adotante: id }).update(dados),
  delete: (id: number) => Adotantes.where({ id_adotante: id }).delete(),
};
