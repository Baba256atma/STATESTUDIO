/**
 * APP-9:2 — Confidence Evolution Engine domain types.
 * Extends APP-9:1 foundation types — does not redefine them.
 */

import type { CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION } from "./confidenceEvolutionConstants.ts";
import type {
  ConfidenceChangeReason,
  ConfidenceEvolutionMetadata,
  ConfidenceLevel,
  ConfidenceRecordId,
  ConfidenceSource,
  ConfidenceEvolutionValidationIssue,
  ConfidenceEvolutionValidationResult,
  ConfidenceWorkspaceId,
  DecisionId,
  JournalEntryId,
  ScenarioId,
} from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION = "APP-9/2" as const;
export const CONFIDENCE_EVOLUTION_ENGINE_ARCHITECTURE_VERSION = "APP-9/2-confidence-engine-arch" as const;

export const CONFIDENCE_RECORD_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "reviewed",
  "archived",
] as const);

export type ConfidenceRecordStatus = (typeof CONFIDENCE_RECORD_STATUS_KEYS)[number];
export type ConfidenceRecordTag = string;

export const CONFIDENCE_EVOLUTION_ENGINE_TAGS = Object.freeze([
  "[APP9_2]",
  "[CONFIDENCE_EVOLUTION_ENGINE]",
  "[IMMUTABLE_RECORDS]",
  "[APPEND_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_EVOLUTION_ENGINE_MANDATORY_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "confidenceLevel",
  "confidenceScore",
  "source",
  "reason",
  "notes",
  "evidenceReferences",
  "tags",
  "metadata",
  "status",
  "createdAt",
  "updatedAt",
  "contractVersion",
  "revisionVersion",
] as const);

export const CONFIDENCE_EVOLUTION_UPDATABLE_FIELDS = Object.freeze([
  "title",
  "confidenceLevel",
  "confidenceScore",
  "reason",
  "notes",
  "evidenceReferences",
  "previousConfidence",
  "metadata",
  "status",
  "tags",
] as const);

export const CONFIDENCE_EVOLUTION_IMMUTABLE_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "createdAt",
  "source",
] as const);

export const CONFIDENCE_EVOLUTION_LINK_IMMUTABLE_FIELDS = Object.freeze([
  "decisionId",
  "scenarioId",
  "journalEntryId",
] as const);

export const CONFIDENCE_EVOLUTION_ENGINE_LIMITS = Object.freeze({
  maxPublishedRecords: 10_000,
  maxTagsPerRecord: 32,
  maxTagLength: 64,
  maxTitleLength: 256,
  maxNotesLength: 4096,
  maxEvidenceReferences: 32,
  maxMetadataKeys: 32,
  maxMetadataValueLength: 512,
  minConfidenceScore: 0,
  maxConfidenceScore: 1,
} as const);

export const CONFIDENCE_EVOLUTION_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  duplicateRecord: "duplicate_record",
  registryFull: "registry_full",
  engineNotInitialized: "engine_not_initialized",
  workspaceIsolation: "workspace_isolation",
  recordNotFound: "record_not_found",
  forbiddenMutation: "forbidden_mutation",
  foundationIncompatible: "foundation_incompatible",
} as const);

export const CONFIDENCE_EVOLUTION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "ConfidenceChart",
  "ConfidenceEditor",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type ConfidenceEvolutionEngineRecord = Readonly<{
  id: ConfidenceRecordId;
  workspaceId: ConfidenceWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  journalEntryId?: JournalEntryId;
  title: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  source: ConfidenceSource;
  reason: ConfidenceChangeReason;
  notes: string;
  evidenceReferences: readonly string[];
  previousConfidence?: ConfidenceLevel;
  tags: readonly ConfidenceRecordTag[];
  metadata: ConfidenceEvolutionMetadata;
  status: ConfidenceRecordStatus;
  createdAt: string;
  updatedAt: string;
  contractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  revisionVersion: number;
  archived: boolean;
  readOnly: true;
}>;

export type CreateConfidenceRecordInput = Readonly<{
  id?: ConfidenceRecordId;
  workspaceId: ConfidenceWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  journalEntryId?: JournalEntryId;
  title: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  source: ConfidenceSource;
  reason: ConfidenceChangeReason;
  notes?: string;
  evidenceReferences?: readonly string[];
  previousConfidence?: ConfidenceLevel;
  tags?: readonly ConfidenceRecordTag[];
  metadata?: Readonly<Record<string, string>>;
  status?: ConfidenceRecordStatus;
  createdAt: string;
  updatedAt?: string;
}>;

export type NormalizedConfidenceRecordInput = Readonly<{
  id?: ConfidenceRecordId;
  workspaceId: ConfidenceWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  journalEntryId?: JournalEntryId;
  title: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  source: ConfidenceSource;
  reason: ConfidenceChangeReason;
  notes: string;
  evidenceReferences: readonly string[];
  previousConfidence?: ConfidenceLevel;
  tags: readonly ConfidenceRecordTag[];
  metadata: ConfidenceEvolutionMetadata;
  status: ConfidenceRecordStatus;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateConfidenceMetadataInput = Readonly<{
  id: ConfidenceRecordId;
  workspaceId: ConfidenceWorkspaceId;
  title?: string;
  confidenceLevel?: ConfidenceLevel;
  confidenceScore?: number;
  reason?: ConfidenceChangeReason;
  notes?: string;
  evidenceReferences?: readonly string[];
  previousConfidence?: ConfidenceLevel;
  tags?: readonly ConfidenceRecordTag[];
  metadata?: Readonly<Record<string, string>>;
  status?: ConfidenceRecordStatus;
  updatedAt?: string;
}>;

export type ConfidenceRecordFilter = Readonly<{
  workspaceId: ConfidenceWorkspaceId;
  confidenceLevel?: ConfidenceLevel;
  source?: ConfidenceSource;
  reason?: ConfidenceChangeReason;
  status?: ConfidenceRecordStatus;
  tag?: ConfidenceRecordTag;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  includeArchived?: boolean;
}>;

export type ConfidenceEvolutionEngineState = Readonly<{
  engineId: "confidence-evolution-engine";
  contractVersion: typeof CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  publishedRecordCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ConfidenceRecordResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ConfidenceEvolutionEngineError | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionEngineRegistrySnapshot = Readonly<{
  registryVersion: string;
  publishedRecordCount: number;
  recordIds: readonly ConfidenceRecordId[];
  readOnly: true;
}>;

export type ConfidenceEvolutionEngineCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionEngineCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export function createConfidenceEvolutionEngineError(
  code: string,
  message: string,
  field?: string
): ConfidenceEvolutionEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function confidenceEvolutionEngineErrorFromCode(
  code: keyof typeof CONFIDENCE_EVOLUTION_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): ConfidenceEvolutionEngineError {
  return createConfidenceEvolutionEngineError(CONFIDENCE_EVOLUTION_ENGINE_ERROR_CODES[code], message, field);
}

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };
