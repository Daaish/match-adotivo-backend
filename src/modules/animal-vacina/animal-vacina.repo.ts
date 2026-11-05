import { db } from "../../prisma/db";
import type { CreateAnimalVacinaDTO, UpdateAnimalVacinaDTO } from "./animal-vacina.types";

const Aplicacoes = db.orm.public.AnimalVacina;

export const animalVacinaRepository = {
  findAll: async () => Aplicacoes.orderBy((a) => a.id_animal_vacina.asc()).all(),
  findById: async (id: number) => Aplicacoes.where({ id_animal_vacina: id }).first(),
  create: async (dados: CreateAnimalVacinaDTO) => Aplicacoes.create(dados),
  update: async (id: number, dados: UpdateAnimalVacinaDTO) =>
    Aplicacoes.where({ id_animal_vacina: id }).update(dados),
  delete: async (id: number) => Aplicacoes.where({ id_animal_vacina: id }).delete(),
};
