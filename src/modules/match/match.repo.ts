import { db } from "../../prisma/db";
import type { CreateMatchDTO, StatusMatchDTO } from "./match.types";
const Matches = db.orm.public.Match;
export const matchRepository = {
  findAll: () => Matches.orderBy(m => m.id_match.asc()).all(),
  findById: (id: number) => Matches.where({ id_match: id }).first(),
  findApprovedByAnimal: (id_animal: number) => Matches.where({id_animal, status: "APROVADO"}).first(),
  create: (dados: CreateMatchDTO) => Matches.create(dados),
  updateStatus: (id: number, dados: StatusMatchDTO) => Matches.where({ id_match: id }).update(dados),
  delete: (id: number) => Matches.where({id_match: id}).delete(),
};
