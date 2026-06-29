/**
 * APP-1:2 — Executive Time Context Store.
 * In-memory workspace context metadata — no persistence, no UI coupling.
 */

import { EXECUTIVE_TIME_DEFAULT_CONTEXT } from "./executiveTimeContract.ts";
import type {
  ExecutiveTimeContextKey,
  ExecutiveTimeContextStoreRecord,
  ExecutiveTimeCustomRange,
  ExecutiveTimeWorkspaceId,
} from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_CONTEXT_STORE_VERSION = "APP-1/2" as const;

const storeByWorkspace = new Map<ExecutiveTimeWorkspaceId, ExecutiveTimeContextStoreRecord>();

function nowIso(): string {
  return new Date().toISOString();
}

function cloneRecord(record: ExecutiveTimeContextStoreRecord): ExecutiveTimeContextStoreRecord {
  return Object.freeze({
    ...record,
    customRange: record.customRange ? Object.freeze({ ...record.customRange }) : null,
    contextMetadata: Object.freeze({ ...record.contextMetadata }),
  });
}

function defaultRecord(workspaceId: ExecutiveTimeWorkspaceId): ExecutiveTimeContextStoreRecord {
  return Object.freeze({
    workspaceId,
    currentContextId: EXECUTIVE_TIME_DEFAULT_CONTEXT,
    customRange: null,
    contextMetadata: Object.freeze({ source: "executive-time-context-store" }),
    version: EXECUTIVE_TIME_CONTEXT_STORE_VERSION,
    updatedAt: nowIso(),
  });
}

export function resetExecutiveTimeContextStoreForTests(): void {
  storeByWorkspace.clear();
}

export function getExecutiveTimeContextStoreRecord(
  workspaceId: ExecutiveTimeWorkspaceId
): ExecutiveTimeContextStoreRecord {
  const key = workspaceId.trim();
  const existing = storeByWorkspace.get(key);
  if (existing) return cloneRecord(existing);
  const created = defaultRecord(key);
  storeByWorkspace.set(key, created);
  return cloneRecord(created);
}

export function setExecutiveTimeContextStoreRecord(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  currentContextId: ExecutiveTimeContextKey;
  customRange?: ExecutiveTimeCustomRange | null;
  contextMetadata?: Readonly<Record<string, unknown>>;
}): ExecutiveTimeContextStoreRecord {
  const key = input.workspaceId.trim();
  const record = Object.freeze({
    workspaceId: key,
    currentContextId: input.currentContextId,
    customRange: input.customRange
      ? Object.freeze({ ...input.customRange })
      : null,
    contextMetadata: Object.freeze({ ...(input.contextMetadata ?? { source: "executive-time-context-store" }) }),
    version: EXECUTIVE_TIME_CONTEXT_STORE_VERSION,
    updatedAt: nowIso(),
  });
  storeByWorkspace.set(key, record);
  return cloneRecord(record);
}

export function updateExecutiveTimeContextCustomRange(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  customRange: ExecutiveTimeCustomRange | null;
}): ExecutiveTimeContextStoreRecord {
  const current = getExecutiveTimeContextStoreRecord(input.workspaceId);
  return setExecutiveTimeContextStoreRecord({
    workspaceId: current.workspaceId,
    currentContextId: current.currentContextId,
    customRange: input.customRange,
    contextMetadata: current.contextMetadata,
  });
}

export function listExecutiveTimeContextStoreRecords(): readonly ExecutiveTimeContextStoreRecord[] {
  return Object.freeze(
    [...storeByWorkspace.values()]
      .map((entry) => cloneRecord(entry))
      .sort((a, b) => a.workspaceId.localeCompare(b.workspaceId))
  );
}

export function isExecutiveTimeContextStoreIsolated(): boolean {
  const records = listExecutiveTimeContextStoreRecords();
  return records.every(
    (record) =>
      record.version === EXECUTIVE_TIME_CONTEXT_STORE_VERSION &&
      !("dashboardState" in (record.contextMetadata as Record<string, unknown>)) &&
      !("assistantState" in (record.contextMetadata as Record<string, unknown>)) &&
      !("timelineState" in (record.contextMetadata as Record<string, unknown>))
  );
}
