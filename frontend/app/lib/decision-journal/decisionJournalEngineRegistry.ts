/**
 * APP-8:2 — Decision Journal append-only registry.
 */

import type { DecisionJournalEntryId, DecisionWorkspaceId } from "./decisionJournalTypes.ts";
import {
  DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
  DECISION_JOURNAL_ENGINE_LIMITS,
  type DecisionJournalEngineEntry,
  type DecisionJournalEngineRegistrySnapshot,
  type DecisionJournalEntryResult,
  decisionJournalEngineErrorFromCode,
} from "./decisionJournalEngineTypes.ts";

const publishedEntries = new Map<DecisionJournalEntryId, DecisionJournalEngineEntry>();
const revisionHistory = new Map<DecisionJournalEntryId, DecisionJournalEngineEntry[]>();
const workspaceIndex = new Map<DecisionWorkspaceId, Set<DecisionJournalEntryId>>();
const workspaceSequenceCounters = new Map<DecisionWorkspaceId, number>();

export function resetDecisionJournalEngineRegistryForTests(): void {
  publishedEntries.clear();
  revisionHistory.clear();
  workspaceIndex.clear();
  workspaceSequenceCounters.clear();
}

export function isDuplicateDecisionJournalEntryId(entryId: DecisionJournalEntryId): boolean {
  return publishedEntries.has(entryId);
}

export function allocateDecisionJournalEntrySequenceNumber(workspaceId: DecisionWorkspaceId): number {
  const current = workspaceSequenceCounters.get(workspaceId) ?? 0;
  const next = current + 1;
  workspaceSequenceCounters.set(workspaceId, next);
  return next;
}

export function generateDecisionJournalEntryId(
  workspaceId: DecisionWorkspaceId,
  sequence: number
): DecisionJournalEntryId {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return `decision-journal-entry-${safeWorkspace}-${String(sequence).padStart(6, "0")}`;
}

function indexEntry(entry: DecisionJournalEngineEntry): void {
  const ids = workspaceIndex.get(entry.workspaceId) ?? new Set<DecisionJournalEntryId>();
  ids.add(entry.id);
  workspaceIndex.set(entry.workspaceId, ids);
}

export function registerDecisionJournalEntry(
  entry: DecisionJournalEngineEntry
): DecisionJournalEntryResult<DecisionJournalEngineEntry> {
  if (publishedEntries.has(entry.id)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate journal entry id: ${entry.id}.`,
      data: null,
      error: decisionJournalEngineErrorFromCode("duplicateEntry", "Duplicate journal entry id.", "id"),
      readOnly: true as const,
    });
  }
  if (publishedEntries.size >= DECISION_JOURNAL_ENGINE_LIMITS.maxPublishedEntries) {
    return Object.freeze({
      success: false,
      reason: "Decision journal entry registry is full.",
      data: null,
      error: decisionJournalEngineErrorFromCode("registryFull", "Registry full."),
      readOnly: true as const,
    });
  }

  publishedEntries.set(entry.id, entry);
  revisionHistory.set(entry.id, Object.freeze([entry]));
  indexEntry(entry);

  return Object.freeze({
    success: true,
    reason: "Decision journal entry registered.",
    data: entry,
    error: null,
    readOnly: true as const,
  });
}

export function replaceDecisionJournalEntryRevision(
  previous: DecisionJournalEngineEntry,
  next: DecisionJournalEngineEntry
): DecisionJournalEntryResult<DecisionJournalEngineEntry> {
  if (previous.id !== next.id) {
    return Object.freeze({
      success: false,
      reason: "Journal entry identity must remain stable across revisions.",
      data: null,
      error: decisionJournalEngineErrorFromCode("forbiddenMutation", "Entry id cannot change.", "id"),
      readOnly: true as const,
    });
  }
  if (next.revisionVersion !== previous.revisionVersion + 1) {
    return Object.freeze({
      success: false,
      reason: "Revision version must increment by exactly one.",
      data: null,
      error: decisionJournalEngineErrorFromCode(
        "validationFailure",
        "Invalid revision increment.",
        "revisionVersion"
      ),
      readOnly: true as const,
    });
  }

  const history = revisionHistory.get(previous.id) ?? Object.freeze([previous]);
  revisionHistory.set(previous.id, Object.freeze([...history, next]));
  publishedEntries.set(next.id, next);

  return Object.freeze({
    success: true,
    reason: "Decision journal entry revision registered.",
    data: next,
    error: null,
    readOnly: true as const,
  });
}

export function getDecisionJournalEntryById(entryId: DecisionJournalEntryId): DecisionJournalEngineEntry | null {
  return publishedEntries.get(entryId) ?? null;
}

export function getDecisionJournalEntriesByWorkspace(
  workspaceId: DecisionWorkspaceId
): readonly DecisionJournalEngineEntry[] {
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => publishedEntries.get(id))
      .filter((entry): entry is DecisionJournalEngineEntry => entry !== undefined)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  );
}

export function getDecisionJournalEntryRevisionHistory(
  entryId: DecisionJournalEntryId
): readonly DecisionJournalEngineEntry[] {
  return Object.freeze(revisionHistory.get(entryId) ?? []);
}

export function getDecisionJournalEngineRegistrySnapshot(): DecisionJournalEngineRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
    publishedEntryCount: publishedEntries.size,
    entryIds: Object.freeze([...publishedEntries.keys()]),
    readOnly: true as const,
  });
}

export const DecisionJournalEngineRegistry = Object.freeze({
  resetDecisionJournalEngineRegistryForTests,
  isDuplicateDecisionJournalEntryId,
  allocateDecisionJournalEntrySequenceNumber,
  generateDecisionJournalEntryId,
  registerDecisionJournalEntry,
  replaceDecisionJournalEntryRevision,
  getDecisionJournalEntryById,
  getDecisionJournalEntriesByWorkspace,
  getDecisionJournalEntryRevisionHistory,
  getDecisionJournalEngineRegistrySnapshot,
});
