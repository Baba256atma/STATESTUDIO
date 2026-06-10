/**
 * Dashboard accordion expansion state persistence (session-scoped).
 */

import type { DashboardAccordionExpansionState } from "./dashboardAccordionPanelContract.ts";

const STORAGE_PREFIX = "nexora:dashboard-accordion:";

export type DashboardAccordionPersistenceSnapshot = Readonly<Record<string, DashboardAccordionExpansionState>>;

const memoryPersistence = new Map<string, DashboardAccordionPersistenceSnapshot>();

function readStorage(): Storage | null {
  if (typeof globalThis.sessionStorage === "undefined") return null;
  return globalThis.sessionStorage;
}

export function buildAccordionContextSignature(input: {
  dashboardContext: string;
  normalizedContextId?: string | null;
}): string {
  const contextId = input.normalizedContextId?.trim() || "default";
  return `${input.dashboardContext}:${contextId}`;
}

function parsePersistenceSnapshot(raw: string | null | undefined): DashboardAccordionPersistenceSnapshot {
  if (!raw) return Object.freeze({});
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: Record<string, DashboardAccordionExpansionState> = {};
    for (const [panelId, value] of Object.entries(parsed)) {
      if (value === "expanded" || value === "collapsed") {
        next[panelId] = value;
      }
    }
    return Object.freeze(next);
  } catch {
    return Object.freeze({});
  }
}

export function loadAccordionPersistence(contextSignature: string): DashboardAccordionPersistenceSnapshot {
  const memory = memoryPersistence.get(contextSignature);
  if (memory) return memory;

  const storage = readStorage();
  if (!storage) return Object.freeze({});
  return parsePersistenceSnapshot(storage.getItem(`${STORAGE_PREFIX}${contextSignature}`));
}

export function saveAccordionPersistence(
  contextSignature: string,
  snapshot: DashboardAccordionPersistenceSnapshot
): void {
  const frozen = Object.freeze({ ...snapshot });
  memoryPersistence.set(contextSignature, frozen);

  const storage = readStorage();
  if (!storage) return;
  try {
    storage.setItem(`${STORAGE_PREFIX}${contextSignature}`, JSON.stringify(frozen));
  } catch {
    // Ignore quota / privacy mode failures.
  }
}

export function clearAccordionPersistenceForTests(): void {
  memoryPersistence.clear();
  const storage = readStorage();
  if (!storage) return;
  const keysToRemove: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
  }
  for (const key of keysToRemove) storage.removeItem(key);
}
