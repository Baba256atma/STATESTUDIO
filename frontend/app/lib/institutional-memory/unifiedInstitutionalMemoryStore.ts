import { stableSignature } from "../intelligence/shared/dedupe";
import { UNIFIED_INSTITUTIONAL_MEMORY_MAX_SNAPSHOTS } from "./unifiedInstitutionalMemoryGuards";
import type {
  EnterpriseMemoryCognitionSnapshot,
  MemoryRuntimeStatus,
  UnifiedInstitutionalMemoryStoreState,
} from "./unifiedInstitutionalMemoryTypes";

function buildStoreSignature(state: {
  snapshots: readonly EnterpriseMemoryCognitionSnapshot[];
  runtimeStatus: MemoryRuntimeStatus;
}): string {
  return stableSignature([
    "d9-2-10-unified-memory",
    state.snapshots.length,
    state.runtimeStatus,
    state.snapshots[0]?.snapshotId ?? "none",
  ]);
}

export function createUnifiedInstitutionalMemoryStore(
  initial?: UnifiedInstitutionalMemoryStoreState
): {
  getState(): UnifiedInstitutionalMemoryStoreState;
  upsertSnapshot(
    snapshot: EnterpriseMemoryCognitionSnapshot,
    now?: number
  ): UnifiedInstitutionalMemoryStoreState;
  setLastEvaluationSignature(signature: string): void;
  setLastRuntimeStatus(status: MemoryRuntimeStatus): void;
  clear(): UnifiedInstitutionalMemoryStoreState;
} {
  let state: UnifiedInstitutionalMemoryStoreState = initial ?? {
    snapshots: [],
    runtimeStatus: "initializing",
    signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
    updatedAt: 0,
    lastEvaluationSignature: null,
    lastRuntimeStatus: null,
  };

  return {
    getState(): UnifiedInstitutionalMemoryStoreState {
      return {
        ...state,
        snapshots: state.snapshots.map((s) => ({ ...s })),
      };
    },

    upsertSnapshot(
      snapshot: EnterpriseMemoryCognitionSnapshot,
      now = Date.now()
    ): UnifiedInstitutionalMemoryStoreState {
      const byId = new Map<string, EnterpriseMemoryCognitionSnapshot>();
      for (const s of state.snapshots) byId.set(s.snapshotId, s);
      const existing = byId.get(snapshot.snapshotId);
      byId.set(
        snapshot.snapshotId,
        existing
          ? {
              ...existing,
              ...snapshot,
              generatedAt: Math.max(existing.generatedAt, snapshot.generatedAt),
            }
          : { ...snapshot }
      );
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, UNIFIED_INSTITUTIONAL_MEMORY_MAX_SNAPSHOTS);
      state = {
        ...state,
        snapshots: Object.freeze(next),
        runtimeStatus: snapshot.runtimeStatus,
        signature: buildStoreSignature({ snapshots: next, runtimeStatus: snapshot.runtimeStatus }),
        updatedAt: now,
      };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    setLastRuntimeStatus(status: MemoryRuntimeStatus): void {
      state = { ...state, lastRuntimeStatus: status };
    },

    clear(): UnifiedInstitutionalMemoryStoreState {
      state = {
        snapshots: [],
        runtimeStatus: "initializing",
        signature: buildStoreSignature({ snapshots: [], runtimeStatus: "initializing" }),
        updatedAt: 0,
        lastEvaluationSignature: null,
        lastRuntimeStatus: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createUnifiedInstitutionalMemoryStore>
>();

export function getUnifiedInstitutionalMemoryStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createUnifiedInstitutionalMemoryStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetUnifiedInstitutionalMemoryStores(): void {
  storesByOrganization.clear();
}
