import { db } from "../../prisma/db";
import type { CreateMatchDTO, StatusMatchDTO } from "./match.types";
const Matches = db.orm.public.Match;
const statusAprovado = "APROVADO";
export const matchRepository = {
  findAll: () => Matches.orderBy(m => m.id_match.asc()).all(),
  findById: (id: number) => Matches.where({ id_match: id }).first(),
  // Localiza a adoção aprovada usada pelas regras de solicitação e disponibilidade — 18/11/2026.
  findApprovedByAnimal: (idAnimal: number) => Matches.where({ id_animal: idAnimal, status: statusAprovado }).first(),
  // Consulta de uma vez os IDs dos animais com adoção aprovada — 18/11/2026.
  listarAnimaisComAdocaoAprovada: () => Matches.select("id_animal").where({ status: statusAprovado }).all(),
  create: (dados: CreateMatchDTO) => Matches.create(dados),
  updateStatus: (id: number, dados: StatusMatchDTO) => Matches.where({ id_match: id }).update(dados),
  delete: (id: number) => Matches.where({id_match: id}).delete(),
};
