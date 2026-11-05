#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4efd905501747358b51572ec86342b3fac0d34a267922d14a39e7d3acc27716d/contract';
import startContract from '../../snapshots/4efd905501747358b51572ec86342b3fac0d34a267922d14a39e7d3acc27716d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/8e6667342525565fb4702cb884581df7d7b5709161e2c56e4e8011924142cbfa/contract';
import endContract from '../../snapshots/8e6667342525565fb4702cb884581df7d7b5709161e2c56e4e8011924142cbfa/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('id_adotante', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('id_instituicao', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('perfil', 'text', {
          notNull: true,
          default: lit('SEM_PERFIL'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_id_adotante_key',
        columns: ['id_adotante'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_id_instituicao_key',
        columns: ['id_instituicao'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Usuario',
        foreignKey: {
          name: 'Usuario_id_adotante_fkey',
          columns: ['id_adotante'],
          references: { schema: 'public', table: 'Adotante', columns: ['id_adotante'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Usuario',
        foreignKey: {
          name: 'Usuario_id_instituicao_fkey',
          columns: ['id_instituicao'],
          references: { schema: 'public', table: 'Instituicao', columns: ['id_instituicao'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
