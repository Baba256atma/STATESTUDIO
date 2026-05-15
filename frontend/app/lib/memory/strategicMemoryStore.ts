import type {
  StrategicMemoryRecord,
  StrategicMemoryStoreState,
} from "./strategicMemoryTypes.ts";

const DEFAULT_LIMIT = 30;

function signature(record: StrategicMemoryRecord): string {
  return [
    record.category,
    record.domainId ?? "",
    record.relatedScenarioIds?.slice().sort().join(",") ?? "",
    record.title.trim().toLowerCase(),
  ].join("|");
}

function mergeRecords(existing: StrategicMemoryRecord, next: StrategicMemoryRecord): StrategicMemoryRecord {
  return {
    ...existing,
    title: next.title || existing.title,
    summary: next.summary || existing.summary,
    severity: next.severity ?? existing.severity,
    confidence: Math.max(existing.confidence ?? 0, next.confidence ?? 0),
    recurrenceCount: Math.max(1, (existing.recurrenceCount ?? 1) + (next.recurrenceCount ?? 1)),
    lastObservedAt: Math.max(existing.lastObservedAt, next.lastObservedAt),
    firstObservedAt: Math.min(existing.firstObservedAt, next.firstObservedAt),
    relatedObjectIds: Array.from(new Set([...existing.relatedObjectIds, ...next.relatedObjectIds])),
    relatedScenarioIds: Array.from(new Set([...(existing.relatedScenarioIds ?? []), ...(next.relatedScenarioIds ?? [])])),
  };
}

export function createStrategicMemoryStore(initial?: StrategicMemoryStoreState) {
  let state: StrategicMemoryStoreState = initial
    ? { records: initial.records.slice(), updatedAt: initial.updatedAt }
    : { records: [], updatedAt: 0 };

  return {
    getState(): StrategicMemoryStoreState {
      return {
        records: state.records.map((record) => ({ ...record, relatedObjectIds: record.relatedObjectIds.slice(), relatedScenarioIds: record.relatedScenarioIds?.slice() })),
        updatedAt: state.updatedAt,
      };
    },
    addRecords(records: StrategicMemoryRecord[], now = 0, limit = DEFAULT_LIMIT): StrategicMemoryStoreState {
      const bySignature = new Map<string, StrategicMemoryRecord>();
      for (const record of state.records) bySignature.set(signature(record), record);
      for (const record of records) {
        const key = signature(record);
        const existing = bySignature.get(key);
        bySignature.set(key, existing ? mergeRecords(existing, record) : { ...record });
      }
      state = {
        records: Array.from(bySignature.values())
          .sort((left, right) => {
            if (right.lastObservedAt !== left.lastObservedAt) return right.lastObservedAt - left.lastObservedAt;
            return left.id.localeCompare(right.id);
          })
          .slice(0, limit),
        updatedAt: now,
      };
      return this.getState();
    },
    clear(): StrategicMemoryStoreState {
      state = { records: [], updatedAt: 0 };
      return this.getState();
    },
  };
}

export function mergeStrategicMemoryRecords(params: {
  existing?: StrategicMemoryRecord[];
  incoming?: StrategicMemoryRecord[];
  limit?: number;
}): StrategicMemoryRecord[] {
  const store = createStrategicMemoryStore({ records: params.existing ?? [], updatedAt: 0 });
  return store.addRecords(params.incoming ?? [], 0, params.limit ?? DEFAULT_LIMIT).records;
}
