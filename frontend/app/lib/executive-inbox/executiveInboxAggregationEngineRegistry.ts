/**
 * APP-11:2 — Executive Inbox Aggregation Engine immutable registry.
 */

import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS,
} from "./executiveInboxAggregationEngineConstants.ts";
import type {
  ExecutiveInboxItem,
  InboxAggregationEngineResult,
  InboxAggregationRegistrySnapshot,
  InboxItemId,
  InboxWorkspaceId,
} from "./executiveInboxAggregationEngineTypes.ts";
import { validateExecutiveInboxItem } from "./executiveInboxAggregationEngineValidation.ts";

const itemRegistry = new Map<InboxItemId, ExecutiveInboxItem>();
const workspaceIndex = new Map<InboxWorkspaceId, Set<InboxItemId>>();

function indexItem(item: ExecutiveInboxItem): void {
  const ids = workspaceIndex.get(item.workspaceId) ?? new Set<InboxItemId>();
  ids.add(item.itemId);
  workspaceIndex.set(item.workspaceId, ids);
}

function unindexItem(item: ExecutiveInboxItem): void {
  const ids = workspaceIndex.get(item.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(item.itemId);
  if (ids.size === 0) {
    workspaceIndex.delete(item.workspaceId);
  }
}

export function resetExecutiveInboxAggregationEngineRegistryForTests(): void {
  itemRegistry.clear();
  workspaceIndex.clear();
}

export function inboxItemExists(itemId: InboxItemId): boolean {
  return itemRegistry.has(itemId);
}

export function registerInboxItem(item: ExecutiveInboxItem): InboxAggregationEngineResult<ExecutiveInboxItem> {
  const validation = validateExecutiveInboxItem(item);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (itemRegistry.has(item.itemId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate inbox item id: ${item.itemId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_item",
        message: "Duplicate inbox item id.",
        field: "itemId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (itemRegistry.size >= EXECUTIVE_INBOX_AGGREGATION_ENGINE_LIMITS.maxRegisteredItems) {
    return Object.freeze({
      success: false,
      reason: "Inbox item registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Inbox item registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  itemRegistry.set(item.itemId, item);
  indexItem(item);
  return Object.freeze({
    success: true,
    reason: "Executive inbox item registered.",
    data: item,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterInboxItem(itemId: InboxItemId): InboxAggregationEngineResult<InboxItemId> {
  const existing = itemRegistry.get(itemId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Inbox item not found: ${itemId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Inbox item not found.",
        field: "itemId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  itemRegistry.delete(itemId);
  unindexItem(existing);
  return Object.freeze({
    success: true,
    reason: "Executive inbox item unregistered.",
    data: itemId,
    error: null,
    readOnly: true as const,
  });
}

export function getInboxItem(itemId: InboxItemId): ExecutiveInboxItem | null {
  return itemRegistry.get(itemId) ?? null;
}

export function getInboxItems(workspaceId?: InboxWorkspaceId): readonly ExecutiveInboxItem[] {
  if (!workspaceId) {
    return Object.freeze([...itemRegistry.values()].sort((left, right) => left.itemId.localeCompare(right.itemId)));
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((itemId) => itemRegistry.get(itemId))
      .filter((entry): entry is ExecutiveInboxItem => entry !== undefined)
      .sort((left, right) => left.itemId.localeCompare(right.itemId))
  );
}

export function getInboxAggregationSnapshot(): InboxAggregationRegistrySnapshot {
  const itemIds = Object.freeze([...itemRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    itemCount: itemRegistry.size,
    itemIds,
    readOnly: true as const,
  });
}

export const ExecutiveInboxAggregationEngineRegistry = Object.freeze({
  resetExecutiveInboxAggregationEngineRegistryForTests,
  inboxItemExists,
  registerInboxItem,
  unregisterInboxItem,
  getInboxItem,
  getInboxItems,
  getInboxAggregationSnapshot,
});
