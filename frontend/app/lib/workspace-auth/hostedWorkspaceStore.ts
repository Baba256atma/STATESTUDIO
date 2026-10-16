/**
 * HOSTED-MVP:2 — one Postgres-compatible workspace store.
 *
 * Production opens the directory in NEXORA_DATABASE_DIR.
 * A missing or unreadable database fails closed.
 */

import { mkdir } from "node:fs/promises";

import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";

import { HOSTED_WORKSPACE_SCHEMA_SQL } from "./hostedWorkspaceSchema.ts";
import type { HostedWorkspace, HostedWorkspaceKind } from "./hostedWorkspaceRecord.ts";

export class HostedWorkspaceUnavailable extends Error {
  constructor() {
    super("hosted_workspace_unavailable");
  }
}

type WorkspaceRow = {
  workspace_id: string;
  owner_user_id: string;
  name: string;
  kind: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const PRODUCTION_POOL_MAX = 5;

export type HostedSql = {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<{ rows: T[] }>;
  transaction<T>(callback: (tx: HostedSql) => Promise<T>): Promise<T>;
};

const PRODUCTION_KEY = "__nexoraHostedWorkspaceDatabase";
let testDatabase: PGlite | null = null;
let unavailableForTests = false;

type DatabaseGlobal = typeof globalThis & {
  [PRODUCTION_KEY]?: Promise<HostedSql>;
};

function asHostedSql(database: {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;
  transaction?: (callback: (tx: { query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }> }) => Promise<unknown>) => Promise<unknown>;
}): HostedSql {
  const sql: HostedSql = {
    async query<T extends Record<string, unknown>>(text: string, params?: readonly unknown[]) {
      const result = await database.query(text, params ? [...params] : undefined);
      return { rows: result.rows as T[] };
    },
    transaction<T>(callback: (tx: HostedSql) => Promise<T>) {
      if (!database.transaction) return callback(sql);
      return database.transaction(async (tx) => callback(asHostedSql(tx))) as Promise<T>;
    },
  };
  return sql;
}

async function openPostgres(connectionString: string): Promise<HostedSql> {
  const pool = new Pool({ connectionString, max: PRODUCTION_POOL_MAX });
  const database = {
    query: async (text: string, params?: unknown[]) => {
      const result = await pool.query(text, params);
      return { rows: result.rows as unknown[] };
    },
    transaction: async (callback: (tx: { query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }> }) => Promise<unknown>) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const tx = {
          query: async (text: string, params?: unknown[]) => {
            const result = await client.query(text, params);
            return { rows: result.rows as unknown[] };
          },
        };
        const value = await callback(tx);
        await client.query("COMMIT");
        return value;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
  const hosted = asHostedSql(database);
  await pool.query(HOSTED_WORKSPACE_SCHEMA_SQL);
  return hosted;
}

function timestamp(value: Date | string): string {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new HostedWorkspaceUnavailable();
  return parsed.toISOString();
}

function record(row: WorkspaceRow): HostedWorkspace {
  if (row.kind !== "BUSINESS" && row.kind !== "PROJECT") throw new HostedWorkspaceUnavailable();
  return Object.freeze({
    workspaceId: row.workspace_id,
    ownerUserId: row.owner_user_id,
    name: row.name,
    kind: row.kind,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at),
  });
}

async function openDatabase(directory: string): Promise<PGlite> {
  await mkdir(directory, { recursive: true });
  const database = new PGlite(directory);
  await database.exec(HOSTED_WORKSPACE_SCHEMA_SQL);
  return database;
}

export async function openHostedWorkspaceDatabaseForTests(directory: string): Promise<void> {
  testDatabase = await openDatabase(directory);
  unavailableForTests = false;
}

export async function closeHostedWorkspaceDatabaseForTests(): Promise<void> {
  await testDatabase?.close();
  testDatabase = null;
  unavailableForTests = false;
  delete (globalThis as DatabaseGlobal)[PRODUCTION_KEY];
}

export function failHostedWorkspaceDatabaseForTests(unavailable: boolean): void {
  unavailableForTests = unavailable;
}

async function database(): Promise<HostedSql> {
  if (unavailableForTests) throw new HostedWorkspaceUnavailable();
  if (testDatabase) return asHostedSql(testDatabase);
  const connectionString = process.env.DATABASE_URL?.trim();
  const directory = process.env.NEXORA_DATABASE_DIR?.trim();
  if (connectionString) {
    const globalDatabase = globalThis as DatabaseGlobal;
    globalDatabase[PRODUCTION_KEY] ??= openPostgres(connectionString).catch((error: unknown) => {
      delete globalDatabase[PRODUCTION_KEY];
      throw error instanceof HostedWorkspaceUnavailable ? error : new HostedWorkspaceUnavailable();
    });
    return globalDatabase[PRODUCTION_KEY];
  }
  if (!directory) throw new HostedWorkspaceUnavailable();
  const globalDatabase = globalThis as DatabaseGlobal;
  globalDatabase[PRODUCTION_KEY] ??= openDatabase(directory).then(asHostedSql).catch((error: unknown) => {
    delete globalDatabase[PRODUCTION_KEY];
    throw error instanceof HostedWorkspaceUnavailable ? error : new HostedWorkspaceUnavailable();
  });
  return globalDatabase[PRODUCTION_KEY];
}

/** Same connection HOSTED-MVP:2 already opens. Callers share this accessor. */
export function hostedWorkspaceDatabase(): Promise<HostedSql> {
  return database();
}

export async function insertHostedWorkspace(input: {
  readonly workspaceId: string;
  readonly ownerUserId: string;
  readonly name: string;
  readonly kind: HostedWorkspaceKind;
  readonly createdAt: string;
}): Promise<HostedWorkspace> {
  const db = await database();
  await db.query(
    `INSERT INTO hosted_workspace (workspace_id, owner_user_id, name, kind, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $5)`,
    [input.workspaceId, input.ownerUserId, input.name, input.kind, input.createdAt],
  );
  const loaded = await readHostedWorkspaceRow(input.workspaceId);
  if (!loaded) throw new HostedWorkspaceUnavailable();
  return loaded;
}

export async function listHostedWorkspaces(ownerUserId: string): Promise<readonly HostedWorkspace[]> {
  const db = await database();
  const result = await db.query<WorkspaceRow>(
    `SELECT workspace_id, owner_user_id, name, kind, created_at, updated_at
     FROM hosted_workspace
     WHERE owner_user_id = $1
     ORDER BY created_at ASC, workspace_id ASC`,
    [ownerUserId],
  );
  return result.rows.map(record);
}

export async function readHostedWorkspaceRow(workspaceId: string): Promise<HostedWorkspace | null> {
  const db = await database();
  const result = await db.query<WorkspaceRow>(
    `SELECT workspace_id, owner_user_id, name, kind, created_at, updated_at
     FROM hosted_workspace
     WHERE workspace_id = $1`,
    [workspaceId],
  );
  const row = result.rows[0];
  return row ? record(row) : null;
}
