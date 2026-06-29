/**
 * APP-8:1 — Decision Journal registry.
 */

import {
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_DEFAULT_LIMITS,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import type {
  DecisionJournalConfidenceRegistration,
  DecisionJournalFutureExtensionRegistration,
  DecisionJournalId,
  DecisionJournalMetadataExtensionRegistration,
  DecisionJournalPlatformResult,
  DecisionJournalRegistration,
  DecisionJournalRegistrationInput,
  DecisionJournalRegistrySnapshot,
  DecisionJournalSourceRegistration,
  DecisionJournalStatusRegistration,
} from "./decisionJournalTypes.ts";
import {
  validateDecisionJournalRegistration,
  validateMetadataExtensionRegistration,
} from "./decisionJournalValidation.ts";

export const DECISION_JOURNAL_REGISTRY_VERSION = "APP-8/1-REGISTRY-1" as const;

const journalRegistry = new Map<DecisionJournalId, DecisionJournalRegistration>();
const statusRegistry = new Map<string, DecisionJournalStatusRegistration>();
const sourceRegistry = new Map<string, DecisionJournalSourceRegistration>();
const confidenceRegistry = new Map<string, DecisionJournalConfidenceRegistration>();
const metadataExtensionRegistry = new Map<string, DecisionJournalMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, DecisionJournalFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): DecisionJournalPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetDecisionJournalRegistryForTests(): void {
  journalRegistry.clear();
  statusRegistry.clear();
  sourceRegistry.clear();
  confidenceRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerDecisionJournal(
  input: DecisionJournalRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): DecisionJournalPlatformResult<DecisionJournalRegistration> {
  const validation = validateDecisionJournalRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (journalRegistry.has(input.journalId)) {
    return createResult(false, `Decision journal already registered: ${input.journalId}.`, null);
  }
  if (journalRegistry.size >= DECISION_JOURNAL_DEFAULT_LIMITS.maxRegisteredJournals) {
    return createResult(false, "Decision journal registry limit reached.", null);
  }
  const entry = Object.freeze({
    journalId: input.journalId,
    workspaceId: input.workspaceId,
    label: input.label.trim(),
    description: input.description.trim(),
    registeredAt,
    readOnly: true as const,
  });
  journalRegistry.set(entry.journalId, entry);
  return createResult(true, "Decision journal registered.", entry);
}

export function registerDecisionJournalStatusType(
  input: DecisionJournalStatusRegistration
): DecisionJournalPlatformResult<DecisionJournalStatusRegistration> {
  if (!input.statusId || !input.label.trim()) {
    return createResult(false, "statusId and label are required.", null);
  }
  if (statusRegistry.has(input.statusId)) {
    return createResult(false, `Journal status already registered: ${input.statusId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  statusRegistry.set(entry.statusId, entry);
  return createResult(true, "Journal status registered.", entry);
}

export function registerDecisionJournalSourceType(
  input: DecisionJournalSourceRegistration
): DecisionJournalPlatformResult<DecisionJournalSourceRegistration> {
  if (!input.sourceId || !input.label.trim()) {
    return createResult(false, "sourceId and label are required.", null);
  }
  if (sourceRegistry.has(input.sourceId)) {
    return createResult(false, `Journal source already registered: ${input.sourceId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  sourceRegistry.set(entry.sourceId, entry);
  return createResult(true, "Journal source registered.", entry);
}

export function registerDecisionJournalConfidenceLevel(
  input: DecisionJournalConfidenceRegistration
): DecisionJournalPlatformResult<DecisionJournalConfidenceRegistration> {
  if (!input.confidenceId || !input.label.trim()) {
    return createResult(false, "confidenceId and label are required.", null);
  }
  if (confidenceRegistry.has(input.confidenceId)) {
    return createResult(false, `Confidence level already registered: ${input.confidenceId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  confidenceRegistry.set(entry.confidenceId, entry);
  return createResult(true, "Confidence level registered.", entry);
}

export function registerMetadataExtension(
  input: DecisionJournalMetadataExtensionRegistration
): DecisionJournalPlatformResult<DecisionJournalMetadataExtensionRegistration> {
  const validation = validateMetadataExtensionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Metadata extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  metadataExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Metadata extension registered.", entry);
}

export function registerFutureExtension(
  input: DecisionJournalFutureExtensionRegistration
): DecisionJournalPlatformResult<DecisionJournalFutureExtensionRegistration> {
  if (!input.extensionId.trim() || !input.phaseKey.trim()) {
    return createResult(false, "extensionId and phaseKey are required.", null);
  }
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

export function getDecisionJournalById(journalId: DecisionJournalId): DecisionJournalRegistration | null {
  return journalRegistry.get(journalId) ?? null;
}

export function listDecisionJournalIds(): readonly DecisionJournalId[] {
  return Object.freeze([...journalRegistry.keys()].sort((left, right) => left.localeCompare(right)));
}

export function getDecisionJournalRegistry(): Readonly<{
  journals: readonly DecisionJournalRegistration[];
  statusTypes: readonly DecisionJournalStatusRegistration[];
  sourceTypes: readonly DecisionJournalSourceRegistration[];
  confidenceLevels: readonly DecisionJournalConfidenceRegistration[];
  metadataExtensions: readonly DecisionJournalMetadataExtensionRegistration[];
  futureExtensions: readonly DecisionJournalFutureExtensionRegistration[];
  readOnly: true;
}> {
  return Object.freeze({
    journals: Object.freeze([...journalRegistry.values()].sort((a, b) => a.journalId.localeCompare(b.journalId))),
    statusTypes: Object.freeze([...statusRegistry.values()].sort((a, b) => a.statusId.localeCompare(b.statusId))),
    sourceTypes: Object.freeze([...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))),
    confidenceLevels: Object.freeze(
      [...confidenceRegistry.values()].sort((a, b) => a.rank - b.rank)
    ),
    metadataExtensions: Object.freeze(
      [...metadataExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    futureExtensions: Object.freeze(
      [...futureExtensionRegistry.values()].sort((a, b) => a.extensionId.localeCompare(b.extensionId))
    ),
    readOnly: true as const,
  });
}

export function getDecisionJournalRegistrySnapshot(): DecisionJournalRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_JOURNAL_REGISTRY_VERSION,
    journalCount: journalRegistry.size,
    journalIds: listDecisionJournalIds(),
    statusTypeCount: statusRegistry.size,
    sourceTypeCount: sourceRegistry.size,
    confidenceTypeCount: confidenceRegistry.size,
    metadataExtensionCount: metadataExtensionRegistry.size,
    futureExtensionCount: futureExtensionRegistry.size,
    readOnly: true as const,
  });
}

export function seedDefaultDecisionJournalRegistry(): void {
  if (statusRegistry.size === 0) {
    for (const statusId of DECISION_JOURNAL_STATUS_KEYS) {
      registerDecisionJournalStatusType(
        Object.freeze({
          statusId,
          label: statusId.replace(/_/g, " "),
          description: `Canonical ${statusId} decision journal status.`,
          terminal: statusId === "archived",
        })
      );
    }
  }
  if (sourceRegistry.size === 0) {
    for (const sourceId of DECISION_JOURNAL_SOURCE_KEYS) {
      registerDecisionJournalSourceType(
        Object.freeze({
          sourceId,
          label: sourceId.replace(/_/g, " "),
          description: `Canonical ${sourceId} decision journal source.`,
        })
      );
    }
  }
  if (confidenceRegistry.size === 0) {
    const ranks: Record<(typeof DECISION_JOURNAL_CONFIDENCE_KEYS)[number], number> = {
      very_low: 1,
      low: 2,
      medium: 3,
      high: 4,
      very_high: 5,
    };
    for (const confidenceId of DECISION_JOURNAL_CONFIDENCE_KEYS) {
      registerDecisionJournalConfidenceLevel(
        Object.freeze({
          confidenceId,
          label: confidenceId.replace(/_/g, " "),
          description: `Canonical ${confidenceId} confidence level.`,
          rank: ranks[confidenceId],
        })
      );
    }
  }
}

export const DecisionJournalRegistry = Object.freeze({
  registerDecisionJournal,
  registerDecisionJournalStatusType,
  registerDecisionJournalSourceType,
  registerDecisionJournalConfidenceLevel,
  registerMetadataExtension,
  registerFutureExtension,
  getDecisionJournalById,
  getDecisionJournalRegistry,
  getDecisionJournalRegistrySnapshot,
  listDecisionJournalIds,
  seedDefaultDecisionJournalRegistry,
  resetDecisionJournalRegistryForTests,
  version: DECISION_JOURNAL_REGISTRY_VERSION,
});
