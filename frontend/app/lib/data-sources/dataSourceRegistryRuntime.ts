import {
  DATA_SOURCE_REGISTRY_VERSION,
  buildDataSourceId,
  normalizeDataSourceRecordCount,
  normalizeDataSourceStatus,
  normalizeDataSourceTimestamp,
  normalizeDataSourceType,
  normalizeNullableDataSourceTimestamp,
  type DataSourceRegistryEntry,
  type DataSourceRegistryMutationResult,
  type DataSourceRegistryPersistenceAdapter,
  type DataSourceRegistrySnapshot,
  type RegisterDataSourceInput,
  type UpdateDataSourceInput,
} from "./dataSourceRegistryContract.ts";

const DATA_SOURCE_REGISTRY_STORAGE_KEY = "nexora:typec:data-source-registry:v1";

let registryInitialized = false;
let sources: DataSourceRegistryEntry[] = [];
let updatedAt: string | null = null;
let persistenceAdapter: DataSourceRegistryPersistenceAdapter =
  createDefaultDataSourceRegistryPersistenceAdapter();

function nowIso(): string {
  return new Date().toISOString();
}

function freezeSource(source: DataSourceRegistryEntry): DataSourceRegistryEntry {
  return Object.freeze({ ...source });
}

function createDefaultDataSourceRegistryPersistenceAdapter(): DataSourceRegistryPersistenceAdapter {
  return Object.freeze({
    load(): DataSourceRegistrySnapshot | null {
      if (typeof globalThis.localStorage === "undefined") return null;
      try {
        const raw = globalThis.localStorage.getItem(DATA_SOURCE_REGISTRY_STORAGE_KEY);
        if (!raw) return null;
        return parseDataSourceRegistrySnapshot(raw);
      } catch {
        return null;
      }
    },
    save(snapshot: DataSourceRegistrySnapshot): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.setItem(DATA_SOURCE_REGISTRY_STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        // Best-effort persistence; registry state remains in memory.
      }
    },
    clear(): void {
      if (typeof globalThis.localStorage === "undefined") return;
      try {
        globalThis.localStorage.removeItem(DATA_SOURCE_REGISTRY_STORAGE_KEY);
      } catch {
        // Best-effort cleanup only.
      }
    },
  });
}

function isRegistryEntry(value: unknown): value is DataSourceRegistryEntry {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.sourceId === "string" &&
    typeof record.sourceName === "string" &&
    typeof record.sourceType === "string" &&
    typeof record.sourceStatus === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string" &&
    typeof record.recordCount === "number"
  );
}

function parseDataSourceRegistrySnapshot(raw: string): DataSourceRegistrySnapshot | null {
  try {
    const parsed = JSON.parse(raw) as DataSourceRegistrySnapshot;
    if (!parsed || parsed.version !== DATA_SOURCE_REGISTRY_VERSION || !Array.isArray(parsed.sources)) {
      return null;
    }
    return Object.freeze({
      version: DATA_SOURCE_REGISTRY_VERSION,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      sources: Object.freeze(parsed.sources.filter(isRegistryEntry).map(freezeSource)),
    });
  } catch {
    return null;
  }
}

function buildSnapshot(): DataSourceRegistrySnapshot {
  return Object.freeze({
    version: DATA_SOURCE_REGISTRY_VERSION,
    updatedAt,
    sources: Object.freeze(sources.map(freezeSource)),
  });
}

function persistRegistry(): void {
  persistenceAdapter.save(buildSnapshot());
}

function initializeRegistry(): void {
  if (registryInitialized) return;
  registryInitialized = true;
  const loaded = persistenceAdapter.load();
  if (!loaded) {
    sources = [];
    updatedAt = null;
    return;
  }
  sources = loaded.sources.map(freezeSource);
  updatedAt = loaded.updatedAt;
}

function commitRegistryChange(timestamp = nowIso()): void {
  updatedAt = timestamp;
  persistRegistry();
}

function buildRegisteredSource(input: RegisterDataSourceInput): DataSourceRegistryEntry | null {
  const sourceName = typeof input.sourceName === "string" ? input.sourceName.trim() : "";
  if (!sourceName) return null;
  const sourceType = normalizeDataSourceType(input.sourceType);
  if (!sourceType) return null;

  const timestamp = nowIso();
  const createdAt = normalizeDataSourceTimestamp(input.createdAt, timestamp);
  const updatedTimestamp = normalizeDataSourceTimestamp(input.updatedAt, createdAt);
  const explicitId = typeof input.sourceId === "string" ? input.sourceId.trim() : "";
  const sourceId =
    explicitId || buildDataSourceId({ sourceName, sourceType, createdAt });

  return Object.freeze({
    sourceId,
    sourceName,
    sourceType,
    sourceStatus: normalizeDataSourceStatus(input.sourceStatus),
    createdAt,
    updatedAt: updatedTimestamp,
    lastSyncAt: normalizeNullableDataSourceTimestamp(input.lastSyncAt),
    recordCount: normalizeDataSourceRecordCount(input.recordCount),
  });
}

export function setDataSourceRegistryPersistenceAdapterForTests(
  adapter: DataSourceRegistryPersistenceAdapter | null
): void {
  persistenceAdapter = adapter ?? createDefaultDataSourceRegistryPersistenceAdapter();
}

export function resetDataSourceRegistryForTests(): void {
  registryInitialized = false;
  sources = [];
  updatedAt = null;
  persistenceAdapter = createDefaultDataSourceRegistryPersistenceAdapter();
}

export function listDataSources(): readonly DataSourceRegistryEntry[] {
  initializeRegistry();
  return Object.freeze(sources.map(freezeSource));
}

export function getDataSourceRegistrySnapshot(): DataSourceRegistrySnapshot {
  initializeRegistry();
  return buildSnapshot();
}

export function registerDataSource(
  input: RegisterDataSourceInput
): DataSourceRegistryMutationResult {
  initializeRegistry();
  const source = buildRegisteredSource(input);
  if (!source) {
    return Object.freeze({ success: false, source: null, reason: "invalid_source" });
  }
  if (sources.some((entry) => entry.sourceId === source.sourceId)) {
    return Object.freeze({ success: false, source: null, reason: "duplicate_source" });
  }
  sources = [...sources, source];
  commitRegistryChange(source.updatedAt);
  return Object.freeze({ success: true, source, reason: "registered" });
}

export function updateDataSource(
  input: UpdateDataSourceInput
): DataSourceRegistryMutationResult {
  initializeRegistry();
  const sourceId = typeof input.sourceId === "string" ? input.sourceId.trim() : "";
  if (!sourceId) {
    return Object.freeze({ success: false, source: null, reason: "missing_source_id" });
  }
  const existing = sources.find((source) => source.sourceId === sourceId);
  if (!existing) {
    return Object.freeze({ success: false, source: null, reason: "source_not_found" });
  }

  const nextType =
    input.sourceType === undefined
      ? existing.sourceType
      : normalizeDataSourceType(input.sourceType);
  if (!nextType) {
    return Object.freeze({ success: false, source: null, reason: "invalid_source_type" });
  }

  const sourceName =
    typeof input.sourceName === "string" && input.sourceName.trim()
      ? input.sourceName.trim()
      : existing.sourceName;
  const updatedTimestamp = normalizeDataSourceTimestamp(input.updatedAt, nowIso());
  const next: DataSourceRegistryEntry = Object.freeze({
    ...existing,
    sourceName,
    sourceType: nextType,
    sourceStatus:
      input.sourceStatus === undefined
        ? existing.sourceStatus
        : normalizeDataSourceStatus(input.sourceStatus),
    updatedAt: updatedTimestamp,
    lastSyncAt:
      input.lastSyncAt === undefined
        ? existing.lastSyncAt
        : normalizeNullableDataSourceTimestamp(input.lastSyncAt),
    recordCount:
      input.recordCount === undefined
        ? existing.recordCount
        : normalizeDataSourceRecordCount(input.recordCount),
  });

  sources = sources.map((source) => (source.sourceId === sourceId ? next : source));
  commitRegistryChange(updatedTimestamp);
  return Object.freeze({ success: true, source: next, reason: "updated" });
}

export function removeDataSource(sourceIdInput: unknown): DataSourceRegistryMutationResult {
  initializeRegistry();
  const sourceId = typeof sourceIdInput === "string" ? sourceIdInput.trim() : "";
  if (!sourceId) {
    return Object.freeze({ success: false, source: null, reason: "missing_source_id" });
  }
  const source = sources.find((entry) => entry.sourceId === sourceId) ?? null;
  if (!source) {
    return Object.freeze({ success: false, source: null, reason: "source_not_found" });
  }
  sources = sources.filter((entry) => entry.sourceId !== sourceId);
  commitRegistryChange();
  return Object.freeze({ success: true, source, reason: "removed" });
}

export function clearDataSourceRegistryForTests(): void {
  sources = [];
  updatedAt = null;
  persistenceAdapter.clear();
}

