/**
 * DATA-UX:6 — IndexedDB snapshot backing for csvRealDataImportStore.
 * Not a second source lifecycle. Restore hydrates; it does not commit.
 */
import {
  clearCsvRealDataImportStore,
  exportCsvRealDataImportState,
  hydrateCsvRealDataImportState,
  registerCsvDurabilityPersistHook,
  type CsvCommittedImport,
  type CsvImportCandidate,
  type CsvRealDataImportExportedState,
  type CsvRemovedSourceReference,
} from "./csvRealDataImportStore.ts";

export const csvRealDataImportDurabilityIdentity = "DATA-UX:6/CsvRealDataImportDurability" as const;
export const csvRealDataImportDurabilityVersion = "1.0.0" as const;
export const csvRealDataImportDurabilityNamespace = "nexora.csv.real-data.durable" as const;
export const CSV_DURABILITY_DATABASE_NAME = "nexora-csv-real-data";
export const CSV_DURABILITY_DATABASE_STORE = "snapshots";
export const CSV_DURABILITY_DATABASE_CURRENT_KEY = "current";

export const CSV_DURABILITY_AUTHORITY_BOUNDARY = Object.freeze({
  canonicalRuntime: "RDI:2/csvRealDataImportStore" as const,
  persistenceBacking: "DATA-UX:6/IndexedDB-snapshot" as const,
  ownsDataReality: false as const,
  ownsEsi: false as const,
  ownsDataObject: false as const,
  restoreCallsCommit: false as const,
  storesNcaConversation: false as const,
  storesStageFocus: false as const,
});

export type CsvDurabilityHealth = "idle" | "durable" | "session-only";

export type CsvDurabilityStorage = Readonly<{
  get(): Promise<string | null>;
  set(value: string): Promise<void>;
  clear(): Promise<void>;
}>;

export type CsvDurableSnapshot = Readonly<{
  identity: typeof csvRealDataImportDurabilityIdentity;
  version: typeof csvRealDataImportDurabilityVersion;
  namespace: typeof csvRealDataImportDurabilityNamespace;
  writtenAt: string;
  committed: readonly CsvCommittedImport[];
  pending: readonly CsvImportCandidate[];
  removed: readonly CsvRemovedSourceReference[];
}>;

export type CsvDurabilityRecoverReport = Readonly<{
  recovered: boolean;
  reason: "recovered" | "empty" | "incompatible" | "invalid";
  rejectedCommitted: number;
  rejectedPending: number;
  snapshot: CsvRealDataImportExportedState | null;
}>;

export type CsvDurabilityPersistReport = Readonly<{
  persisted: boolean;
  reason: "persisted" | "write-failed";
}>;

const CONFIRMATION_SOURCES = new Set(["authoritative-mapping", "manager", "none"]);

let health: CsvDurabilityHealth = "idle";
let healthMessage: string | null = null;
let unbindPersist: (() => void) | null = null;
const healthListeners = new Set<() => void>();

function notifyHealth(): void {
  healthListeners.forEach((listener) => listener());
}

export function getCsvDurabilityHealth(): CsvDurabilityHealth {
  return health;
}

export function getCsvDurabilityHealthMessage(): string | null {
  return healthMessage;
}

export function subscribeCsvDurabilityHealth(listener: () => void): () => void {
  healthListeners.add(listener);
  return () => healthListeners.delete(listener);
}

function setHealth(next: CsvDurabilityHealth, message: string | null): void {
  health = next;
  healthMessage = message;
  notifyHealth();
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export function createMemoryCsvDurabilityStorage(): CsvDurabilityStorage & { failNextWrite: boolean; records: Map<string, string> } {
  const records = new Map<string, string>();
  return {
    records,
    failNextWrite: false,
    async get() {
      return records.get("current") ?? null;
    },
    async set(value: string) {
      if (this.failNextWrite) {
        this.failNextWrite = false;
        throw new Error("csv-durability-write-failed");
      }
      records.set("current", value);
    },
    async clear() {
      records.delete("current");
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validMapping(mapping: unknown): boolean {
  if (!isRecord(mapping) || !Array.isArray(mapping.mappings)) return false;
  return mapping.mappings.every((entry) => {
    if (!isRecord(entry) || typeof entry.sourceColumn !== "string" || typeof entry.confirmed !== "boolean") return false;
    const semantic = entry.semantic;
    if (semantic == null) return true;
    if (!isRecord(semantic)) return false;
    const source = semantic.confirmationSource;
    if (source != null && !CONFIRMATION_SOURCES.has(String(source))) return false;
    return true;
  });
}

function validCommitted(entry: unknown): entry is CsvCommittedImport {
  if (!isRecord(entry)) return false;
  if (typeof entry.workspaceId !== "string" || typeof entry.sourceContextId !== "string" || typeof entry.importId !== "string") return false;
  if (typeof entry.committedAt !== "string" || !isRecord(entry.prepared)) return false;
  const prepared = entry.prepared;
  if (prepared.ready !== true || prepared.workspaceId !== entry.workspaceId || prepared.sourceContextId !== entry.sourceContextId) return false;
  if (!isRecord(prepared.parse) || !Array.isArray(prepared.parse.records) || !Array.isArray(prepared.parse.columns)) return false;
  return validMapping(prepared.mapping);
}

function validPending(entry: unknown): entry is CsvImportCandidate {
  if (!isRecord(entry)) return false;
  if (typeof entry.workspaceId !== "string" || typeof entry.candidateId !== "string" || typeof entry.fileName !== "string") return false;
  if (entry.status === "completed") return false;
  if (!isRecord(entry.input) || typeof entry.input.csvText !== "string" || entry.input.workspaceId !== entry.workspaceId) return false;
  if (entry.mapping != null && !validMapping(entry.mapping)) return false;
  return true;
}

function validRemoved(entry: unknown): entry is CsvRemovedSourceReference {
  return isRecord(entry)
    && typeof entry.workspaceId === "string"
    && typeof entry.sourceId === "string"
    && entry.historical === true
    && entry.suppliesCurrentReality === false
    && entry.transfersSemanticConfirmation === false;
}

export function parseCsvDurableSnapshot(raw: string): CsvDurabilityRecoverReport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Object.freeze({ recovered: false, reason: "invalid", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  if (!isRecord(parsed)) {
    return Object.freeze({ recovered: false, reason: "invalid", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  if (parsed.identity !== csvRealDataImportDurabilityIdentity || parsed.namespace !== csvRealDataImportDurabilityNamespace) {
    return Object.freeze({ recovered: false, reason: "invalid", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  if (parsed.version !== csvRealDataImportDurabilityVersion) {
    return Object.freeze({ recovered: false, reason: "incompatible", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  const committedRaw = Array.isArray(parsed.committed) ? parsed.committed : [];
  const pendingRaw = Array.isArray(parsed.pending) ? parsed.pending : [];
  const removedRaw = Array.isArray(parsed.removed) ? parsed.removed : [];
  const committed = committedRaw.filter(validCommitted);
  const pending = pendingRaw.filter(validPending);
  const removed = removedRaw.filter(validRemoved);
  return Object.freeze({
    recovered: true,
    reason: "recovered",
    rejectedCommitted: committedRaw.length - committed.length,
    rejectedPending: pendingRaw.length - pending.length,
    snapshot: deepFreeze({
      committed,
      pending,
      removed,
    }),
  });
}

export function createCsvDurableSnapshot(writtenAt: string): CsvDurableSnapshot {
  const state = exportCsvRealDataImportState();
  return deepFreeze({
    identity: csvRealDataImportDurabilityIdentity,
    version: csvRealDataImportDurabilityVersion,
    namespace: csvRealDataImportDurabilityNamespace,
    writtenAt,
    committed: state.committed,
    pending: state.pending,
    removed: state.removed,
  });
}

export async function persistCsvRealDataImportDurability(
  storage: CsvDurabilityStorage,
  writtenAt: string,
): Promise<CsvDurabilityPersistReport> {
  try {
    const snapshot = createCsvDurableSnapshot(writtenAt);
    await storage.set(JSON.stringify(snapshot));
    setHealth("durable", null);
    return Object.freeze({ persisted: true, reason: "persisted" });
  } catch {
    setHealth("session-only", "This data is available for this session, but Nexora could not save it for future sessions.");
    return Object.freeze({ persisted: false, reason: "write-failed" });
  }
}

export async function recoverCsvRealDataImportDurability(
  storage: CsvDurabilityStorage,
): Promise<CsvDurabilityRecoverReport> {
  const raw = await storage.get();
  if (!raw) {
    setHealth("durable", null);
    return Object.freeze({ recovered: false, reason: "empty", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  const report = parseCsvDurableSnapshot(raw);
  if (report.reason === "incompatible") {
    console.info("DATA-UX:6 incompatible csv persistence version; skipping hydrate.");
    setHealth("durable", null);
    return report;
  }
  if (report.reason === "invalid" || !report.snapshot) {
    console.info("DATA-UX:6 invalid csv persistence snapshot; skipping hydrate.");
    setHealth("durable", null);
    return report;
  }
  hydrateCsvRealDataImportState(report.snapshot);
  setHealth("durable", null);
  return report;
}

export async function clearCsvRealDataImportDurability(storage: CsvDurabilityStorage): Promise<void> {
  await storage.clear();
  clearCsvRealDataImportStore();
  setHealth("idle", null);
}

function openCsvDurabilityDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CSV_DURABILITY_DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(CSV_DURABILITY_DATABASE_STORE)) {
        request.result.createObjectStore(CSV_DURABILITY_DATABASE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("csv-durability-db-open-failed"));
  });
}

export function createIndexedDbCsvDurabilityStorage(): CsvDurabilityStorage {
  return {
    async get() {
      const database = await openCsvDurabilityDatabase();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(CSV_DURABILITY_DATABASE_STORE, "readonly");
        const request = transaction.objectStore(CSV_DURABILITY_DATABASE_STORE).get(CSV_DURABILITY_DATABASE_CURRENT_KEY);
        request.onsuccess = () => {
          const value = request.result;
          resolve(typeof value === "string" ? value : value == null ? null : JSON.stringify(value));
        };
        request.onerror = () => reject(request.error ?? new Error("csv-durability-read-failed"));
      });
    },
    async set(value: string) {
      const database = await openCsvDurabilityDatabase();
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(CSV_DURABILITY_DATABASE_STORE, "readwrite");
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("csv-durability-write-failed"));
        transaction.objectStore(CSV_DURABILITY_DATABASE_STORE).put(value, CSV_DURABILITY_DATABASE_CURRENT_KEY);
      });
    },
    async clear() {
      const database = await openCsvDurabilityDatabase();
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(CSV_DURABILITY_DATABASE_STORE, "readwrite");
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("csv-durability-clear-failed"));
        transaction.objectStore(CSV_DURABILITY_DATABASE_STORE).delete(CSV_DURABILITY_DATABASE_CURRENT_KEY);
      });
    },
  };
}

export async function persistCsvRealDataImportDurabilityBrowser(writtenAt = new Date().toISOString()): Promise<CsvDurabilityPersistReport> {
  if (typeof indexedDB === "undefined") {
    setHealth("session-only", "This data is available for this session, but Nexora could not save it for future sessions.");
    return Object.freeze({ persisted: false, reason: "write-failed" });
  }
  return persistCsvRealDataImportDurability(createIndexedDbCsvDurabilityStorage(), writtenAt);
}

export async function recoverCsvRealDataImportDurabilityBrowser(): Promise<CsvDurabilityRecoverReport> {
  if (typeof indexedDB === "undefined") {
    return Object.freeze({ recovered: false, reason: "empty", rejectedCommitted: 0, rejectedPending: 0, snapshot: null });
  }
  return recoverCsvRealDataImportDurability(createIndexedDbCsvDurabilityStorage());
}

export async function clearCsvRealDataImportDurabilityBrowser(): Promise<void> {
  if (typeof indexedDB === "undefined") {
    clearCsvRealDataImportStore();
    return;
  }
  await clearCsvRealDataImportDurability(createIndexedDbCsvDurabilityStorage());
}

export function bindCsvRealDataImportDurabilityPersistence(): () => void {
  unbindPersist?.();
  unbindPersist = registerCsvDurabilityPersistHook(() => {
    void persistCsvRealDataImportDurabilityBrowser();
  });
  return () => {
    unbindPersist?.();
    unbindPersist = null;
  };
}
