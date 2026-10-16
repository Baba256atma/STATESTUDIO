/**
 * HOSTED-MVP:3A — one server authority for accepted manager data.
 *
 * Pending CSV text is temporary. Accepted truth is normalized source,
 * mapping, and observations in the hosted workspace database.
 * The browser does not own these records.
 */

import { randomBytes } from "node:crypto";

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  type CsvMappingReview,
  type CsvPreparedImport,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { HostedWorkspaceUnavailable, hostedWorkspaceDatabase } from "./hostedWorkspaceStore.ts";

export const HOSTED_CSV_MAX_BYTES = 2 * 1024 * 1024;
export const HOSTED_CSV_MAX_ROWS = 5000;
export const HOSTED_CSV_MAX_COLUMNS = 40;
export const HOSTED_CSV_MAX_FIELD_CHARS = 2000;
export const HOSTED_PENDING_TTL_MS = 24 * 60 * 60 * 1000;

export type HostedManagerDataErrorCode =
  | "invalid_csv"
  | "csv_too_large"
  | "row_limit_exceeded"
  | "column_limit_exceeded"
  | "field_limit_exceeded"
  | "pending_not_found"
  | "source_not_found"
  | "data_store_unavailable";

export class HostedManagerDataError extends Error {
  readonly code: HostedManagerDataErrorCode;

  constructor(code: HostedManagerDataErrorCode) {
    super(code);
    this.code = code;
  }
}

export type HostedPendingCandidate = Readonly<{
  pendingId: string;
  workspaceId: string;
  fileName: string;
  createdAt: string;
  expiresAt: string;
  prepared: CsvPreparedImport;
}>;

export type HostedManagerDataSnapshot = Readonly<{
  workspaceId: string;
  sources: readonly CsvPreparedImport[];
}>;

type PendingRow = {
  pending_id: string;
  workspace_id: string;
  file_name: string;
  csv_text: string;
  created_at: Date | string;
  expires_at: Date | string;
};

function newId(prefix: string): string {
  return `${prefix}_${randomBytes(16).toString("base64url")}`;
}

function stamp(value: Date | string): string {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new HostedManagerDataError("data_store_unavailable");
  return parsed.toISOString();
}

function storeFailure(error: unknown): never {
  if (error instanceof HostedManagerDataError) throw error;
  if (error instanceof HostedWorkspaceUnavailable) throw new HostedManagerDataError("data_store_unavailable");
  throw new HostedManagerDataError("data_store_unavailable");
}

export function validateHostedCsvText(csvText: string): HostedManagerDataErrorCode | null {
  if (typeof csvText !== "string" || csvText.trim().length === 0) return "invalid_csv";
  if (Buffer.byteLength(csvText, "utf8") > HOSTED_CSV_MAX_BYTES) return "csv_too_large";
  const header = csvText.split(/\r?\n/, 1)[0] ?? "";
  if (header.split(",").length > HOSTED_CSV_MAX_COLUMNS) return "column_limit_exceeded";
  const rowCount = csvText.split(/\r?\n/).filter((line) => line.length > 0).length - 1;
  if (rowCount > HOSTED_CSV_MAX_ROWS) return "row_limit_exceeded";
  const parsed = parseCsvDeterministically(csvText);
  if (!parsed.valid) return "invalid_csv";
  if (parsed.columns.length > HOSTED_CSV_MAX_COLUMNS) return "column_limit_exceeded";
  if (parsed.records.length > HOSTED_CSV_MAX_ROWS) return "row_limit_exceeded";
  for (const column of parsed.columns) {
    if (column.name.length > HOSTED_CSV_MAX_FIELD_CHARS) return "field_limit_exceeded";
  }
  for (const record of parsed.records) {
    for (const value of record.values) {
      if (typeof value === "string" && value.length > HOSTED_CSV_MAX_FIELD_CHARS) return "field_limit_exceeded";
    }
  }
  return null;
}

function safeFileName(fileName: unknown): string {
  if (typeof fileName !== "string") throw new HostedManagerDataError("invalid_csv");
  const name = fileName.trim();
  if (!name.toLowerCase().endsWith(".csv") || name.length > 180 || name.includes("/") || name.includes("\\")) {
    throw new HostedManagerDataError("invalid_csv");
  }
  return name;
}

function mappingFromClient(value: unknown, columnCount: number): CsvMappingReview | undefined {
  if (value == null) return undefined;
  if (typeof value !== "object") throw new HostedManagerDataError("invalid_csv");
  const mapping = value as CsvMappingReview;
  if (!Array.isArray(mapping.mappings) || mapping.mappings.length > HOSTED_CSV_MAX_COLUMNS) {
    throw new HostedManagerDataError("invalid_csv");
  }
  for (const entry of mapping.mappings) {
    if (!Number.isInteger(entry.columnIndex) || entry.columnIndex < 0 || entry.columnIndex >= columnCount) {
      throw new HostedManagerDataError("invalid_csv");
    }
    if (typeof entry.sourceColumn !== "string" || entry.sourceColumn.length > HOSTED_CSV_MAX_FIELD_CHARS) {
      throw new HostedManagerDataError("field_limit_exceeded");
    }
  }
  return mapping;
}

function prepareOwned(input: {
  workspaceId: string;
  fileName: string;
  csvText: string;
  importId: string;
  importedAt: string;
  mapping?: CsvMappingReview;
}): CsvPreparedImport {
  return prepareCsvRealDataImport({
    workspaceId: input.workspaceId as WorkspaceId,
    fileName: input.fileName,
    fileSize: Buffer.byteLength(input.csvText, "utf8"),
    csvText: input.csvText,
    importId: input.importId,
    importedAt: input.importedAt,
  }, input.mapping);
}

/** Ignored columns stay out of accepted observations, including raw-only notes. */
export function acceptedPrepared(prepared: CsvPreparedImport): CsvPreparedImport {
  const ignored = new Set(
    prepared.mapping.mappings.filter((entry) => entry.ignored || entry.targetId == null).map((entry) => entry.columnIndex),
  );
  const records = prepared.parse.records.map((record) => Object.freeze({
    ...record,
    values: Object.freeze(record.values.map((value, index) => (ignored.has(index) ? null : value))),
  }));
  const mappings = prepared.mapping.mappings.map((entry) => {
    if (!ignored.has(entry.columnIndex) || !entry.semantic) return entry;
    return {
      ...entry,
      semantic: { ...entry.semantic, representativeValues: Object.freeze([]) },
    };
  });
  const dropped = new Set<string>();
  for (const record of prepared.parse.records) {
    record.values.forEach((value, index) => {
      if (ignored.has(index) && typeof value === "string" && value.length > 0) dropped.add(value);
    });
  }
  const scrubbed = JSON.parse(JSON.stringify({
    ...prepared,
    fileSize: 0,
    mapping: { ...prepared.mapping, mappings },
    parse: { ...prepared.parse, records },
  })) as CsvPreparedImport;
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") {
      if (dropped.has(value)) return null;
      for (const secret of dropped) {
        if (secret.length > 0 && value.includes(secret)) return null;
      }
      return value;
    }
    if (Array.isArray(value)) return value.map((entry) => walk(entry));
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, key === "payload" ? null : walk(entry)]));
    }
    return value;
  };
  return walk(scrubbed) as CsvPreparedImport;
}

function reviewPrepared(prepared: CsvPreparedImport): CsvPreparedImport {
  const accepted = acceptedPrepared(prepared);
  return JSON.parse(JSON.stringify(accepted)) as CsvPreparedImport;
}

async function deleteExpired(workspaceId: string, now: Date): Promise<void> {
  const db = await hostedWorkspaceDatabase();
  await db.query(
    `DELETE FROM hosted_pending_csv WHERE workspace_id = $1 AND expires_at <= $2`,
    [workspaceId, now.toISOString()],
  );
}

export async function createHostedPendingCsv(input: {
  workspaceId: string;
  fileName: unknown;
  csvText: unknown;
  now?: Date;
}): Promise<HostedPendingCandidate> {
  try {
    const fileName = safeFileName(input.fileName);
    if (typeof input.csvText !== "string") throw new HostedManagerDataError("invalid_csv");
    const invalid = validateHostedCsvText(input.csvText);
    if (invalid) throw new HostedManagerDataError(invalid);
    const now = input.now ?? new Date();
    const pendingId = newId("pnd");
    const importId = newId("imp");
    const createdAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + HOSTED_PENDING_TTL_MS).toISOString();
    const prepared = prepareOwned({
      workspaceId: input.workspaceId,
      fileName,
      csvText: input.csvText,
      importId,
      importedAt: createdAt,
    });
    const db = await hostedWorkspaceDatabase();
    await db.query(
      `INSERT INTO hosted_pending_csv (pending_id, workspace_id, file_name, csv_text, created_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [pendingId, input.workspaceId, fileName, input.csvText, createdAt, expiresAt],
    );
    return Object.freeze({
      pendingId,
      workspaceId: input.workspaceId,
      fileName,
      createdAt,
      expiresAt,
      prepared: reviewPrepared(prepared),
    });
  } catch (error) {
    storeFailure(error);
  }
}

export async function readHostedPendingCsv(workspaceId: string, pendingId: string, now = new Date()): Promise<HostedPendingCandidate> {
  try {
    await deleteExpired(workspaceId, now);
    const db = await hostedWorkspaceDatabase();
    const result = await db.query<PendingRow>(
      `SELECT pending_id, workspace_id, file_name, csv_text, created_at, expires_at
       FROM hosted_pending_csv
       WHERE workspace_id = $1 AND pending_id = $2`,
      [workspaceId, pendingId],
    );
    const row = result.rows[0];
    if (!row) throw new HostedManagerDataError("pending_not_found");
    if (new Date(stamp(row.expires_at)).getTime() <= now.getTime()) {
      await discardHostedPendingCsv(workspaceId, pendingId);
      throw new HostedManagerDataError("pending_not_found");
    }
    const prepared = prepareOwned({
      workspaceId,
      fileName: row.file_name,
      csvText: row.csv_text,
      importId: pendingId,
      importedAt: stamp(row.created_at),
    });
    return Object.freeze({
      pendingId: row.pending_id,
      workspaceId,
      fileName: row.file_name,
      createdAt: stamp(row.created_at),
      expiresAt: stamp(row.expires_at),
      prepared: reviewPrepared(prepared),
    });
  } catch (error) {
    storeFailure(error);
  }
}

export async function discardHostedPendingCsv(workspaceId: string, pendingId: string): Promise<void> {
  try {
    const db = await hostedWorkspaceDatabase();
    const result = await db.query(
      `DELETE FROM hosted_pending_csv WHERE workspace_id = $1 AND pending_id = $2 RETURNING pending_id`,
      [workspaceId, pendingId],
    );
    if (result.rows.length === 0) throw new HostedManagerDataError("pending_not_found");
  } catch (error) {
    storeFailure(error);
  }
}

export async function acceptHostedPendingCsv(input: {
  workspaceId: string;
  pendingId: string;
  mapping?: unknown;
  now?: Date;
}): Promise<HostedManagerDataSnapshot> {
  const now = input.now ?? new Date();
  try {
    await deleteExpired(input.workspaceId, now);
    const db = await hostedWorkspaceDatabase();
    await db.transaction(async (tx) => {
      const pending = await tx.query<PendingRow>(
        `SELECT pending_id, workspace_id, file_name, csv_text, created_at, expires_at
         FROM hosted_pending_csv
         WHERE workspace_id = $1 AND pending_id = $2
         FOR UPDATE`,
        [input.workspaceId, input.pendingId],
      );
      const row = pending.rows[0];
      if (!row) throw new HostedManagerDataError("pending_not_found");
      const parsed = parseCsvDeterministically(row.csv_text);
      const mapping = mappingFromClient(input.mapping, parsed.columns.length);
      const prepared = prepareOwned({
        workspaceId: input.workspaceId,
        fileName: row.file_name,
        csvText: row.csv_text,
        importId: input.pendingId,
        importedAt: stamp(row.created_at),
        mapping,
      });
      if (!prepared.ready) throw new HostedManagerDataError("invalid_csv");
      const accepted = acceptedPrepared(prepared);
      const sourceId = accepted.sourceContextId;
      const existing = await tx.query<{ source_id: string }>(
        `SELECT source_id FROM hosted_data_source WHERE workspace_id = $1 AND source_id = $2`,
        [input.workspaceId, sourceId],
      );
      if (existing.rows.length > 0) {
        await tx.query(
          `DELETE FROM hosted_pending_csv WHERE workspace_id = $1 AND pending_id = $2`,
          [input.workspaceId, input.pendingId],
        );
        return;
      }
      const acceptedAt = now.toISOString();
      await tx.query(
        `INSERT INTO hosted_data_source (
           source_id, workspace_id, import_id, file_name, mapping_json, prepared_json, row_count, accepted_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          sourceId,
          input.workspaceId,
          accepted.importId,
          row.file_name,
          JSON.stringify(accepted.mapping),
          JSON.stringify(accepted),
          accepted.parse.records.length,
          acceptedAt,
        ],
      );
      const observations: { metric: string; value: string; rowNumber: number }[] = [];
      for (const record of accepted.parse.records) {
        record.values.forEach((value, index) => {
          if (value == null || value === "") return;
          observations.push({
            metric: accepted.parse.columns[index]?.name ?? `column-${index}`,
            value: String(value),
            rowNumber: record.rowNumber,
          });
        });
      }
      for (const observation of observations) {
        await tx.query(
          `INSERT INTO hosted_observation (
             observation_id, workspace_id, source_id, metric_id, value_text, observed_at, row_number, provenance
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            newId("obs"),
            input.workspaceId,
            sourceId,
            observation.metric,
            observation.value,
            null,
            observation.rowNumber,
            `csv-row:${observation.rowNumber}`,
          ],
        );
      }
      await tx.query(
        `DELETE FROM hosted_pending_csv WHERE workspace_id = $1 AND pending_id = $2`,
        [input.workspaceId, input.pendingId],
      );
    });
    return readHostedManagerDataSnapshot(input.workspaceId);
  } catch (error) {
    storeFailure(error);
  }
}

export async function readHostedManagerDataSnapshot(workspaceId: string): Promise<HostedManagerDataSnapshot> {
  try {
    const db = await hostedWorkspaceDatabase();
    const result = await db.query<{ prepared_json: string }>(
      `SELECT prepared_json FROM hosted_data_source WHERE workspace_id = $1 ORDER BY accepted_at ASC, source_id ASC`,
      [workspaceId],
    );
    const sources = result.rows.map((row) => JSON.parse(row.prepared_json) as CsvPreparedImport);
    return Object.freeze({ workspaceId, sources: Object.freeze(sources) });
  } catch (error) {
    storeFailure(error);
  }
}

export async function removeHostedDataSource(workspaceId: string, sourceId: string): Promise<void> {
  try {
    const db = await hostedWorkspaceDatabase();
    await db.transaction(async (tx) => {
      const existing = await tx.query(
        `SELECT source_id FROM hosted_data_source WHERE workspace_id = $1 AND source_id = $2 FOR UPDATE`,
        [workspaceId, sourceId],
      );
      if (existing.rows.length === 0) throw new HostedManagerDataError("source_not_found");
      await tx.query(
        `DELETE FROM hosted_observation WHERE workspace_id = $1 AND source_id = $2`,
        [workspaceId, sourceId],
      );
      await tx.query(
        `DELETE FROM hosted_data_source WHERE workspace_id = $1 AND source_id = $2`,
        [workspaceId, sourceId],
      );
    });
  } catch (error) {
    storeFailure(error);
  }
}

export async function hostedPendingRawPresent(workspaceId: string, pendingId: string): Promise<boolean> {
  const db = await hostedWorkspaceDatabase();
  const result = await db.query<{ csv_text: string }>(
    `SELECT csv_text FROM hosted_pending_csv WHERE workspace_id = $1 AND pending_id = $2`,
    [workspaceId, pendingId],
  );
  return result.rows.length === 1 && result.rows[0]!.csv_text.length > 0;
}

export async function hostedDatabaseContainsText(needle: string): Promise<boolean> {
  const db = await hostedWorkspaceDatabase();
  const pending = await db.query(
    `SELECT 1 FROM hosted_pending_csv WHERE csv_text LIKE $1 LIMIT 1`,
    [`%${needle}%`],
  );
  const accepted = await db.query(
    `SELECT 1 FROM hosted_data_source WHERE prepared_json LIKE $1 OR mapping_json LIKE $1 OR file_name LIKE $1 LIMIT 1`,
    [`%${needle}%`],
  );
  const observations = await db.query(
    `SELECT 1 FROM hosted_observation WHERE value_text LIKE $1 OR metric_id LIKE $1 LIMIT 1`,
    [`%${needle}%`],
  );
  return pending.rows.length + accepted.rows.length + observations.rows.length > 0;
}
