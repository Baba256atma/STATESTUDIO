/**
 * INT-1 — Dashboard Intelligence cache contract.
 * Foundation interfaces only — no persistence, no business cache optimization.
 */

import type {
  DashboardIntelligenceDataSnapshot,
  DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";

export type DashboardIntelligenceCacheKey = Readonly<{
  panel: DashboardIntelligencePanelId;
  workspaceId: string;
  objectId: string | null;
  scenarioId: string | null;
  relationshipId: string | null;
  dataSourceId: string | null;
}>;

export type DashboardIntelligenceCacheEntry = Readonly<{
  key: DashboardIntelligenceCacheKey;
  snapshot: DashboardIntelligenceDataSnapshot;
  storedAt: string;
}>;

export type DashboardIntelligenceCacheStore = Readonly<{
  get(key: DashboardIntelligenceCacheKey): DashboardIntelligenceCacheEntry | null;
  set(entry: DashboardIntelligenceCacheEntry): void;
  delete(key: DashboardIntelligenceCacheKey): void;
  clear(): void;
  size(): number;
}>;

export function buildDashboardIntelligenceCacheKey(input: {
  panel: DashboardIntelligencePanelId;
  workspaceId: string;
  objectId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  dataSourceId?: string | null;
}): DashboardIntelligenceCacheKey {
  return Object.freeze({
    panel: input.panel,
    workspaceId: input.workspaceId.trim(),
    objectId: input.objectId?.trim() || null,
    scenarioId: input.scenarioId?.trim() || null,
    relationshipId: input.relationshipId?.trim() || null,
    dataSourceId: input.dataSourceId?.trim() || null,
  });
}

export function serializeDashboardIntelligenceCacheKey(
  key: DashboardIntelligenceCacheKey
): string {
  return JSON.stringify([
    key.panel,
    key.workspaceId,
    key.objectId,
    key.scenarioId,
    key.relationshipId,
    key.dataSourceId,
  ]);
}

export function createInMemoryDashboardIntelligenceCacheStore(): DashboardIntelligenceCacheStore {
  const entries = new Map<string, DashboardIntelligenceCacheEntry>();

  return Object.freeze({
    get(key) {
      return entries.get(serializeDashboardIntelligenceCacheKey(key)) ?? null;
    },
    set(entry) {
      entries.set(serializeDashboardIntelligenceCacheKey(entry.key), Object.freeze(entry));
    },
    delete(key) {
      entries.delete(serializeDashboardIntelligenceCacheKey(key));
    },
    clear() {
      entries.clear();
    },
    size() {
      return entries.size;
    },
  });
}
