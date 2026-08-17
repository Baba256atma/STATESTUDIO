/** DM:3 durable provider using the APP-4 storage adapter contract. */
import type { ExecutiveMemoryStorageProviderAdapter } from "./executiveMemoryStorageProvider.ts";
import { resolveExecutiveMemoryStorageProviderCapabilities } from "./executiveMemoryStorageProvider.ts";
import type { ExecutiveMemoryId, ExecutiveMemoryListQuery, ExecutiveMemoryStorageTransactionSnapshot, ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

export type ExecutiveMemoryKeyValueStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const EXECUTIVE_MEMORY_DURABLE_STORAGE_KEY = "nexora.executive-memory.v1";

function matches(entry: ExecutiveMemoryStoredRecord, query?: ExecutiveMemoryListQuery): boolean {
  return !query || (!query.workspaceId || entry.record.workspaceId === query.workspaceId) && (!query.providerId || entry.record.providerId === query.providerId) && (!query.category || entry.record.category === query.category) && (!query.lifecycle || entry.lifecycle === query.lifecycle);
}
function freezeEntry(entry: ExecutiveMemoryStoredRecord): ExecutiveMemoryStoredRecord { return Object.freeze({ ...entry, record: Object.freeze({ ...entry.record }), readOnly: true as const }); }

export function createExecutiveMemoryLocalStorageProvider(storage: ExecutiveMemoryKeyValueStorage, storageKey = EXECUTIVE_MEMORY_DURABLE_STORAGE_KEY): ExecutiveMemoryStorageProviderAdapter {
  const records = new Map<ExecutiveMemoryId, ExecutiveMemoryStoredRecord>();
  const persist = () => storage.setItem(storageKey, JSON.stringify([...records.values()]));
  const hydrate = () => { records.clear(); const raw = storage.getItem(storageKey); if (!raw) return; try { const parsed: unknown = JSON.parse(raw); if (!Array.isArray(parsed)) return; for (const value of parsed) { const entry = value as ExecutiveMemoryStoredRecord; if (entry?.record?.id) records.set(entry.record.id, freezeEntry(entry)); } } catch { /* invalid durable data is ignored, never promoted to truth */ } };
  return Object.freeze({
    kind: "local_storage", capabilities: resolveExecutiveMemoryStorageProviderCapabilities("local_storage"),
    initialize: hydrate,
    resetForTests: () => { records.clear(); storage.removeItem(storageKey); },
    snapshot: () => Object.freeze({ records: Object.freeze(new Map(records)), readOnly: true as const }),
    restoreSnapshot: (snapshot: ExecutiveMemoryStorageTransactionSnapshot) => { records.clear(); for (const [id, entry] of snapshot.records) records.set(id, freezeEntry(entry)); persist(); },
    get: (id) => records.get(id) ?? null, has: (id) => records.has(id),
    list: (query) => Object.freeze([...records.values()].filter((entry) => matches(entry, query)).sort((a, b) => a.record.id.localeCompare(b.record.id)).map(freezeEntry)),
    commit: (entry) => { records.set(entry.record.id, freezeEntry(entry)); persist(); },
  });
}
