#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4efd905501747358b51572ec86342b3fac0d34a267922d14a39e7d3acc27716d/contract';
import endContract from '../../snapshots/4efd905501747358b51572ec86342b3fac0d34a267922d14a39e7d3acc27716d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/7d55f2e2e68ef11f8108c159b0cd094b99af169851fd5a9f00dee9cadaf17ed1/contract';
import startContract from '../../snapshots/7d55f2e2e68ef11f8108c159b0cd094b99af169851fd5a9f00dee9cadaf17ed1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Usuario',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senha', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
