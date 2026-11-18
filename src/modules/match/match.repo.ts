import { db } from "../../prisma/db";
import type { StatusMatchDTO } from "./match.types";
const Matches = db.orm.public.Match;
const statusAprovado = "APROVADO";
const statusAtivos = ["PENDENTE", "EM ANDAMENTO", statusAprovado];

type Tabelas = typeof db.orm.public;

// Vincula as leituras e escritas de matches ao cliente da transação — 18/11/2026.
function consultasDoAnimal(tabelas: Tabelas, idAnimal: number) {
  const matchesDoAnimal = tabelas.Match.where({ id_animal: idAnimal });
  return {
    // Verifica o cadastro do adotante — 18/11/2026.
    buscarAdotante: (idAdotante: number) => tabelas.Adotante.where({ id_adotante: idAdotante }).first(),
    // Verifica o animal e seu vínculo com a instituição — 18/11/2026.
    buscarAnimal: () => tabelas.Animal.where({ id_animal: idAnimal }).first(),
    // Localiza o match que já foi aprovado para o animal — 18/11/2026.
    buscarAprovado: () => matchesDoAnimal.where({ status: statusAprovado }).first(),
    // Verifica se o adotante já tem uma solicitação ativa — 18/11/2026.
    buscarAtivo: (idAdotante: number) => matchesDoAnimal.where({ id_adotante: idAdotante })
      // Considera apenas os status que bloqueiam uma nova solicitação — 18/11/2026.
      .where((match) => match.status.in(statusAtivos)).first(),
    // Cria a solicitação com o status inicial padrão — 18/11/2026.
    criar: (idAdotante: number) => tabelas.Match.create({ id_animal: idAnimal, id_adotante: idAdotante }),
    // Lê o estado do match após adquirir o bloqueio — 18/11/2026.
    buscarMatch: (id: number) => matchesDoAnimal.where({ id_match: id }).first(),
    // Atualiza o status do match já validado — 18/11/2026.
    atualizarStatus: (id: number, dados: StatusMatchDTO) => matchesDoAnimal.where({ id_match: id }).update(dados),
    // Exclui o match já validado — 18/11/2026.
    excluir: (id: number) => matchesDoAnimal.where({ id_match: id }).delete(),
  };
}

// Serializa as operações de escrita de matches para cada animal — 18/11/2026.
async function comBloqueioAnimal<Resultado>(
  idAnimal: number,
  executar: (consultas: ReturnType<typeof consultasDoAnimal>) => Promise<Resultado>,
): Promise<Resultado> {
  // Mantém o bloqueio até o commit ou rollback e lê os dados depois da espera — 18/11/2026.
  return db.transaction(async function executarNaTransacao(transacao) {
    await transacao.execute(db.raw.sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED`.affectedCount().build());
    // A primeira chave zero reserva o espaço de bloqueios por animal.
    const bloqueio = db.raw.sql`
      SELECT 1 AS adquirido
      FROM pg_advisory_xact_lock(0, ${idAnimal}::integer)
    `.returnsRow({ adquirido: "pg/int4@1" }).build();
    await transacao.query(bloqueio);
    return executar(consultasDoAnimal(transacao.orm.public, idAnimal));
  });
}

export const matchRepository = {
  comBloqueioAnimal,
  findAll: () => Matches.orderBy(m => m.id_match.asc()).all(),
  findById: (id: number) => Matches.where({ id_match: id }).first(),
  // Localiza a adoção aprovada usada pelas regras de solicitação e disponibilidade — 18/11/2026.
  findApprovedByAnimal: (idAnimal: number) => Matches.where({ id_animal: idAnimal, status: statusAprovado }).first(),
  // Consulta de uma vez os IDs dos animais com adoção aprovada — 18/11/2026.
  listarAnimaisComAdocaoAprovada: () => Matches.select("id_animal").where({ status: statusAprovado }).all(),
};
