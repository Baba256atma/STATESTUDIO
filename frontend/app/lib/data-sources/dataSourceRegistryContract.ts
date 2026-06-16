/**
 * DS:1:1 — Canonical Data Source Registry foundation.
 *
 * Registry only: no object creation, scenario generation, or AI analysis.
 */

export const DS_1_1_DATA_SOURCE_REGISTRY_TAG =
  "[DS:1:1_DATA_SOURCE_REGISTRY]" as const;

export const DATA_SOURCE_REGISTRY_VERSION = "1.1.0" as const;

export type DataSourceType =
  | "csv"
  | "excel"
  | "json"
  | "manual_entry"
  | "future_api_connector";

export type DataSourceStatus =
  | "registered"
  | "active"
  | "inactive"
  | "error";

export type DataSourceRegistryEntry = Readonly<{
  sourceId: string;
  sourceName: string;
  sourceType: DataSourceType;
  sourceStatus: DataSourceStatus;
  createdAt: string;
  updatedAt: string;
  lastSyncAt: string | null;
  recordCount: number;
}>;

export type DataSourceRegistrySnapshot = Readonly<{
  version: typeof DATA_SOURCE_REGISTRY_VERSION;
  updatedAt: string | null;
  sources: readonly DataSourceRegistryEntry[];
}>;

export type DataSourceRegistryPersistenceAdapter = Readonly<{
  load(): DataSourceRegistrySnapshot | null;
  save(snapshot: DataSourceRegistrySnapshot): void;
  clear(): void;
}>;

export type RegisterDataSourceInput = Readonly<{
  sourceId?: unknown;
  sourceName: unknown;
  sourceType: unknown;
  sourceStatus?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastSyncAt?: unknown;
  recordCount?: unknown;
}>;

export type UpdateDataSourceInput = Readonly<{
  sourceId: unknown;
  sourceName?: unknown;
  sourceType?: unknown;
  sourceStatus?: unknown;
  updatedAt?: unknown;
  lastSyncAt?: unknown;
  recordCount?: unknown;
}>;

export type DataSourceRegistryMutationResult = Readonly<{
  success: boolean;
  source: DataSourceRegistryEntry | null;
  reason: string;
}>;

export const SUPPORTED_DATA_SOURCE_TYPES: readonly DataSourceType[] = Object.freeze([
  "csv",
  "excel",
  "json",
  "manual_entry",
  "future_api_connector",
]);

export const DATA_SOURCE_STATUSES: readonly DataSourceStatus[] = Object.freeze([
  "registered",
  "active",
  "inactive",
  "error",
]);

const SOURCE_TYPE_SET = new Set<string>(SUPPORTED_DATA_SOURCE_TYPES);
const SOURCE_STATUS_SET = new Set<string>(DATA_SOURCE_STATUSES);

export function isDataSourceType(value: unknown): value is DataSourceType {
  return typeof value === "string" && SOURCE_TYPE_SET.has(value.trim().toLowerCase());
}

export function isDataSourceStatus(value: unknown): value is DataSourceStatus {
  return typeof value === "string" && SOURCE_STATUS_SET.has(value.trim().toLowerCase());
}

export function normalizeDataSourceType(value: unknown): DataSourceType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "manual") return "manual_entry";
  if (normalized === "api" || normalized === "future_api") return "future_api_connector";
  return SOURCE_TYPE_SET.has(normalized) ? (normalized as DataSourceType) : null;
}

export function normalizeDataSourceStatus(value: unknown): DataSourceStatus {
  if (isDataSourceStatus(value)) {
    return value.trim().toLowerCase() as DataSourceStatus;
  }
  return "registered";
}

export function normalizeDataSourceRecordCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

export function normalizeDataSourceTimestamp(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const time = Date.parse(trimmed);
  return Number.isFinite(time) ? new Date(time).toISOString() : fallback;
}

export function normalizeNullableDataSourceTimestamp(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const time = Date.parse(value.trim());
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

export function buildDataSourceId(input: {
  sourceName: string;
  sourceType: DataSourceType;
  createdAt: string;
}): string {
  const namePart = input.sourceName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "source";
  const timePart = String(Date.parse(input.createdAt) || Date.now());
  return `ds:${input.sourceType}:${namePart}:${timePart}`;
}

