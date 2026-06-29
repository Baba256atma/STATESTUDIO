/**
 * APP-4:3 — Executive Memory storage index helpers.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryProviderId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryLifecycleState, ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

export type ExecutiveMemoryStorageIndex = Readonly<{
  byId: ReadonlyMap<ExecutiveMemoryId, ExecutiveMemoryStoredRecord>;
  activeIds: readonly ExecutiveMemoryId[];
  archivedIds: readonly ExecutiveMemoryId[];
  providerIds: readonly ExecutiveMemoryProviderId[];
  workspaceIds: readonly ExecutiveMemoryWorkspaceId[];
  categories: readonly ExecutiveMemoryCategory[];
  readOnly: true;
}>;

export function buildExecutiveMemoryStorageIndex(
  records: readonly ExecutiveMemoryStoredRecord[]
): ExecutiveMemoryStorageIndex {
  const byId = new Map<ExecutiveMemoryId, ExecutiveMemoryStoredRecord>();
  const activeIds: ExecutiveMemoryId[] = [];
  const archivedIds: ExecutiveMemoryId[] = [];
  const providerSet = new Set<ExecutiveMemoryProviderId>();
  const workspaceSet = new Set<ExecutiveMemoryWorkspaceId>();
  const categorySet = new Set<ExecutiveMemoryCategory>();

  for (const entry of records) {
    byId.set(entry.record.id, entry);
    if (entry.lifecycle === "active") {
      activeIds.push(entry.record.id);
    } else {
      archivedIds.push(entry.record.id);
    }
    providerSet.add(entry.record.providerId);
    workspaceSet.add(entry.record.workspaceId);
    categorySet.add(entry.record.category);
  }

  const sortIds = (values: ExecutiveMemoryId[]) =>
    Object.freeze([...values].sort((left, right) => left.localeCompare(right)));

  return Object.freeze({
    byId: Object.freeze(byId),
    activeIds: sortIds(activeIds),
    archivedIds: sortIds(archivedIds),
    providerIds: Object.freeze([...providerSet].sort((left, right) => left.localeCompare(right))),
    workspaceIds: Object.freeze([...workspaceSet].sort((left, right) => left.localeCompare(right))),
    categories: Object.freeze([...categorySet].sort((left, right) => left.localeCompare(right))),
    readOnly: true as const,
  });
}

export function countByKey<T extends string>(
  records: readonly ExecutiveMemoryStoredRecord[],
  selector: (entry: ExecutiveMemoryStoredRecord) => T
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const entry of records) {
    const key = selector(entry);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.freeze({ ...counts });
}

export function countByLifecycle(
  records: readonly ExecutiveMemoryStoredRecord[]
): Readonly<Record<ExecutiveMemoryLifecycleState, number>> {
  const counts: Record<ExecutiveMemoryLifecycleState, number> = {
    active: 0,
    archived: 0,
  };
  for (const entry of records) {
    counts[entry.lifecycle] += 1;
  }
  return Object.freeze({ ...counts });
}
