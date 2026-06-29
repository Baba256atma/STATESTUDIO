/**
 * APP-9:2 — Confidence Evolution Engine.
 * Canonical authority for immutable confidence record creation and controlled metadata updates.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN, CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION } from "./confidenceEvolutionConstants.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST } from "./confidenceEvolutionContracts.ts";
import { isConfidenceEvolutionPlatformInitialized } from "./confidenceEvolutionFoundation.ts";
import { filterConfidenceRecords } from "./confidenceEvolutionFilters.ts";
import { normalizeConfidenceRecord } from "./confidenceEvolutionNormalization.ts";
import {
  allocateConfidenceRecordSequenceNumber,
  generateConfidenceRecordId,
  getConfidenceEvolutionEngineRegistrySnapshot,
  getConfidenceRecordById,
  getConfidenceRecordsByWorkspace,
  getConfidenceRevisionHistory,
  registerConfidenceRecord,
  resetConfidenceEvolutionEngineRegistryForTests,
} from "./confidenceEvolutionEngineRegistry.ts";
import {
  archiveConfidenceRecord,
  updateConfidenceMetadata,
} from "./confidenceEvolutionMutations.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_ENGINE_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_ENGINE_MANDATORY_FIELDS,
  CONFIDENCE_EVOLUTION_ENGINE_TAGS,
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceEvolutionEngineState,
  type ConfidenceRecordResult,
  type CreateConfidenceRecordInput,
  type NormalizedConfidenceRecordInput,
  confidenceEvolutionEngineErrorFromCode,
} from "./confidenceEvolutionEngineTypes.ts";
import {
  validateConfidenceEvolutionEngineRecord,
  validateConfidenceRecordInput,
  validationFailureResult,
} from "./confidenceEvolutionEngineValidation.ts";

export const CONFIDENCE_EVOLUTION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/2",
  title: "Confidence Evolution Engine",
  goal: "Immutable confidence record creation, validation, normalization, append-only registry, and controlled metadata updates.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngineTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionNormalization.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngineValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngineRegistry.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionFilters.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionMutations.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngineRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.test.ts",
    "docs/app-9-2-confidence-evolution-engine.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_ENGINE_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noTrendAnalysis: true,
  noVisualization: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  noDecisionJournalIntegration: true,
  noDecisionTimelineIntegration: true,
  immutableRecords: true,
  appendOnly: true,
  noHardDelete: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeConfidenceEvolutionEngine(
  timestamp: string = engineTimestamp
): ConfidenceEvolutionEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getConfidenceEvolutionEngineState(timestamp);
}

export function isConfidenceEvolutionEngineInitialized(): boolean {
  return engineInitialized;
}

export function getConfidenceEvolutionEngineState(
  timestamp: string = engineTimestamp
): ConfidenceEvolutionEngineState {
  const registry = getConfidenceEvolutionEngineRegistrySnapshot();
  return Object.freeze({
    engineId: "confidence-evolution-engine",
    contractVersion: CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    publishedRecordCount: registry.publishedRecordCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceEvolutionEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetConfidenceEvolutionEngineRegistryForTests();
}

function assertEngineReady<T>(): ConfidenceRecordResult<T> | null {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    return Object.freeze({
      success: false,
      reason: "APP-9:1 Confidence Evolution Foundation is not initialized.",
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("foundationIncompatible", "Foundation not initialized."),
      readOnly: true as const,
    });
  }
  if (!isConfidenceEvolutionEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Confidence Evolution Engine is not initialized.",
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("engineNotInitialized", "Engine not initialized."),
      readOnly: true as const,
    });
  }
  return null;
}

function buildEngineRecord(
  normalized: NormalizedConfidenceRecordInput,
  recordId: string
): ConfidenceEvolutionEngineRecord {
  return Object.freeze({
    id: recordId,
    workspaceId: normalized.workspaceId,
    decisionId: normalized.decisionId,
    scenarioId: normalized.scenarioId,
    journalEntryId: normalized.journalEntryId,
    title: normalized.title,
    confidenceLevel: normalized.confidenceLevel,
    confidenceScore: normalized.confidenceScore,
    source: normalized.source,
    reason: normalized.reason,
    notes: normalized.notes,
    evidenceReferences: normalized.evidenceReferences,
    previousConfidence: normalized.previousConfidence,
    tags: normalized.tags,
    metadata: normalized.metadata,
    status: normalized.status,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    contractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    revisionVersion: 1,
    archived: normalized.status === "archived",
    readOnly: true as const,
  });
}

export function createConfidenceRecord(
  input: CreateConfidenceRecordInput
): ConfidenceRecordResult<ConfidenceEvolutionEngineRecord> {
  const readiness = assertEngineReady<ConfidenceEvolutionEngineRecord>();
  if (readiness) {
    return readiness;
  }

  const normalized = normalizeConfidenceRecord(input);
  const validation = validateConfidenceRecordInput(normalized, { checkDuplicate: Boolean(normalized.id) });
  if (!validation.valid) {
    return validationFailureResult(validation, "Record creation");
  }

  const recordId =
    normalized.id ??
    generateConfidenceRecordId(
      normalized.workspaceId,
      allocateConfidenceRecordSequenceNumber(normalized.workspaceId)
    );

  const record = buildEngineRecord(normalized, recordId);
  const recordValidation = validateConfidenceEvolutionEngineRecord(record);
  if (!recordValidation.valid) {
    return validationFailureResult(recordValidation, "Record creation");
  }

  return registerConfidenceRecord(record);
}

export function validateConfidenceRecord(
  input: CreateConfidenceRecordInput
): ReturnType<typeof validateConfidenceRecordInput> {
  return validateConfidenceRecordInput(normalizeConfidenceRecord(input), {
    checkDuplicate: Boolean(input.id),
  });
}

export function getConfidenceRecords(
  workspaceId: string
): readonly ConfidenceEvolutionEngineRecord[] {
  return getConfidenceRecordsByWorkspace(workspaceId);
}

export { normalizeConfidenceRecord };
export { validateConfidenceRecordInput };
export {
  registerConfidenceRecord,
  getConfidenceRecordById,
  getConfidenceRecordsByWorkspace,
  getConfidenceRevisionHistory,
};
export { filterConfidenceRecords };
export { updateConfidenceMetadata, archiveConfidenceRecord };
export { runConfidenceEvolutionEngineCertification } from "./confidenceEvolutionEngineRunner.ts";

export const CONFIDENCE_EVOLUTION_ENGINE_VERSION = CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION;
export const CONFIDENCE_EVOLUTION_ENGINE_OWNER = "confidence-evolution-engine";

export const ConfidenceEvolutionEngine = Object.freeze({
  initializeConfidenceEvolutionEngine,
  isConfidenceEvolutionEngineInitialized,
  getConfidenceEvolutionEngineState,
  createConfidenceRecord,
  normalizeConfidenceRecord,
  validateConfidenceRecord,
  validateConfidenceRecordInput,
  registerConfidenceRecord,
  getConfidenceRecordById,
  getConfidenceRecords,
  getConfidenceRecordsByWorkspace,
  filterConfidenceRecords,
  updateConfidenceMetadata,
  archiveConfidenceRecord,
  getConfidenceRevisionHistory,
  version: CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
  mandatoryFields: CONFIDENCE_EVOLUTION_ENGINE_MANDATORY_FIELDS,
  tags: CONFIDENCE_EVOLUTION_ENGINE_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_ENGINE_MANDATORY_FIELDS, CONFIDENCE_EVOLUTION_ENGINE_TAGS };
