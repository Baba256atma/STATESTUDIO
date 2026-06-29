/**
 * APP-8:2 — Decision Journal Engine.
 * Canonical authority for immutable executive journal entry creation and controlled metadata updates.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_JOURNAL_MUST_NOT_OWN, DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION } from "./decisionJournalConstants.ts";
import { DECISION_JOURNAL_PLATFORM_SELF_MANIFEST } from "./decisionJournalContracts.ts";
import { isDecisionJournalPlatformInitialized } from "./decisionJournalFoundation.ts";
import { filterDecisionJournalEntries } from "./decisionJournalEngineFilters.ts";
import { normalizeDecisionJournalEntry } from "./decisionJournalEngineNormalization.ts";
import {
  allocateDecisionJournalEntrySequenceNumber,
  generateDecisionJournalEntryId,
  getDecisionJournalEngineRegistrySnapshot,
  getDecisionJournalEntryById,
  getDecisionJournalEntryRevisionHistory,
  getDecisionJournalEntriesByWorkspace,
  registerDecisionJournalEntry,
  resetDecisionJournalEngineRegistryForTests,
} from "./decisionJournalEngineRegistry.ts";
import {
  archiveDecisionJournalEntry,
  updateDecisionJournalMetadata,
} from "./decisionJournalEngineMutations.ts";
import {
  DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
  DECISION_JOURNAL_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_ENGINE_MANDATORY_FIELDS,
  DECISION_JOURNAL_ENGINE_TAGS,
  type CreateDecisionJournalEntryInput,
  type DecisionJournalEngineEntry,
  type DecisionJournalEngineState,
  type DecisionJournalEntryResult,
  type NormalizedDecisionJournalEntryInput,
  decisionJournalEngineErrorFromCode,
} from "./decisionJournalEngineTypes.ts";
import {
  validateDecisionJournalEngineEntry,
  validateDecisionJournalEntryInput,
  validationFailureResult,
} from "./decisionJournalEngineValidation.ts";

export const DECISION_JOURNAL_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/2",
  title: "Decision Journal Engine",
  goal: "Immutable executive journal entry creation, validation, normalization, append-only registry, and controlled metadata updates.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalEngineTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineNormalization.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineRegistry.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineFilters.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineMutations.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngine.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngineRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalEngine.test.ts",
    "docs/app-8-2-decision-journal-engine.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noVisualization: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  noDecisionTimelineIntegration: true,
  immutableEntries: true,
  appendOnly: true,
  noHardDelete: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionJournalEngine(
  timestamp: string = engineTimestamp
): DecisionJournalEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionJournalEngineState(timestamp);
}

export function isDecisionJournalEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionJournalEngineState(
  timestamp: string = engineTimestamp
): DecisionJournalEngineState {
  const registry = getDecisionJournalEngineRegistrySnapshot();
  return Object.freeze({
    engineId: "decision-journal-engine",
    contractVersion: DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    publishedEntryCount: registry.publishedEntryCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionJournalEngineRegistryForTests();
}

function assertEngineReady<T>(): DecisionJournalEntryResult<T> | null {
  if (!isDecisionJournalPlatformInitialized()) {
    return Object.freeze({
      success: false,
      reason: "APP-8:1 Decision Journal Foundation is not initialized.",
      data: null,
      error: decisionJournalEngineErrorFromCode("foundationIncompatible", "Foundation not initialized."),
      readOnly: true as const,
    });
  }
  if (!isDecisionJournalEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Decision Journal Engine is not initialized.",
      data: null,
      error: decisionJournalEngineErrorFromCode("engineNotInitialized", "Engine not initialized."),
      readOnly: true as const,
    });
  }
  return null;
}

function buildEngineEntry(
  normalized: NormalizedDecisionJournalEntryInput,
  entryId: string
): DecisionJournalEngineEntry {
  return Object.freeze({
    id: entryId,
    workspaceId: normalized.workspaceId,
    decisionId: normalized.decisionId,
    scenarioId: normalized.scenarioId,
    title: normalized.title,
    summary: normalized.summary,
    rationale: normalized.rationale,
    assumptions: normalized.assumptions,
    alternatives: normalized.alternatives,
    evidenceReferences: normalized.evidenceReferences,
    acceptedRisks: normalized.acceptedRisks,
    expectedOutcome: normalized.expectedOutcome,
    confidence: normalized.confidence,
    tradeoffs: normalized.tradeoffs,
    constraints: normalized.constraints,
    author: normalized.author,
    reviewers: normalized.reviewers,
    tags: normalized.tags,
    metadata: normalized.metadata,
    status: normalized.status,
    source: normalized.source,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    contractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    revisionVersion: 1,
    archived: normalized.status === "archived",
    readOnly: true as const,
  });
}

export function createDecisionJournalEntry(
  input: CreateDecisionJournalEntryInput
): DecisionJournalEntryResult<DecisionJournalEngineEntry> {
  const readiness = assertEngineReady<DecisionJournalEngineEntry>();
  if (readiness) {
    return readiness;
  }

  const normalized = normalizeDecisionJournalEntry(input);
  const validation = validateDecisionJournalEntryInput(normalized, { checkDuplicate: Boolean(normalized.id) });
  if (!validation.valid) {
    return validationFailureResult(validation, "Entry creation");
  }

  const entryId =
    normalized.id ??
    generateDecisionJournalEntryId(
      normalized.workspaceId,
      allocateDecisionJournalEntrySequenceNumber(normalized.workspaceId)
    );

  const entry = buildEngineEntry(normalized, entryId);
  const entryValidation = validateDecisionJournalEngineEntry(entry);
  if (!entryValidation.valid) {
    return validationFailureResult(entryValidation, "Entry creation");
  }

  return registerDecisionJournalEntry(entry);
}

export function validateDecisionJournalEntry(
  input: CreateDecisionJournalEntryInput
): ReturnType<typeof validateDecisionJournalEntryInput> {
  return validateDecisionJournalEntryInput(normalizeDecisionJournalEntry(input), {
    checkDuplicate: Boolean(input.id),
  });
}

export function getDecisionJournalEntries(
  workspaceId: string
): readonly DecisionJournalEngineEntry[] {
  return getDecisionJournalEntriesByWorkspace(workspaceId);
}

export { normalizeDecisionJournalEntry };
export { validateDecisionJournalEntryInput };
export {
  registerDecisionJournalEntry,
  getDecisionJournalEntryById,
  getDecisionJournalEntriesByWorkspace,
  getDecisionJournalEntryRevisionHistory,
};
export { filterDecisionJournalEntries };
export { updateDecisionJournalMetadata, archiveDecisionJournalEntry };
export { runDecisionJournalEngineCertification } from "./decisionJournalEngineRunner.ts";

export const DECISION_JOURNAL_ENGINE_VERSION = DECISION_JOURNAL_ENGINE_CONTRACT_VERSION;
export const DECISION_JOURNAL_ENGINE_OWNER = "decision-journal-engine";

export const DecisionJournalEngine = Object.freeze({
  initializeDecisionJournalEngine,
  isDecisionJournalEngineInitialized,
  getDecisionJournalEngineState,
  createDecisionJournalEntry,
  normalizeDecisionJournalEntry,
  validateDecisionJournalEntry,
  validateDecisionJournalEntryInput,
  registerDecisionJournalEntry,
  getDecisionJournalEntryById,
  getDecisionJournalEntries,
  getDecisionJournalEntriesByWorkspace,
  filterDecisionJournalEntries,
  updateDecisionJournalMetadata,
  archiveDecisionJournalEntry,
  version: DECISION_JOURNAL_ENGINE_CONTRACT_VERSION,
  mandatoryFields: DECISION_JOURNAL_ENGINE_MANDATORY_FIELDS,
  tags: DECISION_JOURNAL_ENGINE_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_ENGINE_MANDATORY_FIELDS, DECISION_JOURNAL_ENGINE_TAGS };
