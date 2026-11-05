#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7d55f2e2e68ef11f8108c159b0cd094b99af169851fd5a9f00dee9cadaf17ed1/contract';
import endContract from '../../snapshots/7d55f2e2e68ef11f8108c159b0cd094b99af169851fd5a9f00dee9cadaf17ed1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Adotante',
        columns: [
          col('cpf', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endereco', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id_adotante', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('possui_animais', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('quantidade_animais', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tipo_residencia', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipos_animais', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id_adotante'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Animal',
        columns: [
          col('data_nascimento', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('detalhes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('foto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id_animal', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id_instituicao', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('raca', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('tipo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id_animal'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Animal_Vacina',
        columns: [
          col('data_aplicacao', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id_animal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id_animal_vacina', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id_vacina', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id_animal_vacina'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Instituicao',
        columns: [
          col('cnpj', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endereco', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('foto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id_instituicao', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('razao_social', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id_instituicao'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Match',
        columns: [
          col('data_pedido', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id_adotante', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id_animal', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id_match', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDENTE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id_match'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Vacina',
        columns: [
          col('id_vacina', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id_vacina'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Adotante',
        constraint: 'Adotante_cpf_key',
        columns: ['cpf'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Instituicao',
        constraint: 'Instituicao_cnpj_key',
        columns: ['cnpj'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Animal',
        index: 'Animal_id_instituicao_idx_c78bbdf2',
        columns: ['id_instituicao'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Animal_Vacina',
        index: 'Animal_Vacina_id_animal_idx_6941e98e',
        columns: ['id_animal'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Animal_Vacina',
        index: 'Animal_Vacina_id_vacina_idx_1214447b',
        columns: ['id_vacina'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Match',
        index: 'Match_id_adotante_idx_cd3390a2',
        columns: ['id_adotante'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Match',
        index: 'Match_id_animal_idx_6941e98e',
        columns: ['id_animal'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Animal',
        foreignKey: {
          name: 'Animal_id_instituicao_fkey',
          columns: ['id_instituicao'],
          references: { schema: 'public', table: 'Instituicao', columns: ['id_instituicao'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Animal_Vacina',
        foreignKey: {
          name: 'Animal_Vacina_id_animal_fkey',
          columns: ['id_animal'],
          references: { schema: 'public', table: 'Animal', columns: ['id_animal'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Animal_Vacina',
        foreignKey: {
          name: 'Animal_Vacina_id_vacina_fkey',
          columns: ['id_vacina'],
          references: { schema: 'public', table: 'Vacina', columns: ['id_vacina'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Match',
        foreignKey: {
          name: 'Match_id_adotante_fkey',
          columns: ['id_adotante'],
          references: { schema: 'public', table: 'Adotante', columns: ['id_adotante'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Match',
        foreignKey: {
          name: 'Match_id_animal_fkey',
          columns: ['id_animal'],
          references: { schema: 'public', table: 'Animal', columns: ['id_animal'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
