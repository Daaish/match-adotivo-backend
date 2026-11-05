import { db } from "../../prisma/db";
import type { CreateAnimalDTO, UpdateAnimalDTO } from "./animal.types";

const Animais = db.orm.public.Animal;

export const animalRepository = {
  findAll: async () => Animais.orderBy((a) => a.id_animal.asc()).all(),
  findById: async (id: number) => Animais.where({ id_animal: id }).first(),
  create: async (dados: CreateAnimalDTO) => Animais.create(dados),
  update: async (id: number, dados: UpdateAnimalDTO) =>
    Animais.where({ id_animal: id }).update(dados),
  delete: async (id: number) => Animais.where({ id_animal: id }).delete(),
};
