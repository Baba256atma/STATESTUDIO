/**
 * APP-8:2 — Decision Journal Engine domain types.
 * Extends APP-8:1 foundation types — does not redefine them.
 */

import type { DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION } from "./decisionJournalConstants.ts";
import type {
  DecisionId,
  DecisionJournalConfidence,
  DecisionJournalEntryId,
  DecisionJournalMetadata,
  DecisionJournalSource,
  DecisionJournalStatus,
  DecisionJournalTag,
  DecisionJournalValidationIssue,
  DecisionJournalValidationResult,
  DecisionWorkspaceId,
  ScenarioId,
} from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_ENGINE_CONTRACT_VERSION = "APP-8/2" as const;
export const DECISION_JOURNAL_ENGINE_ARCHITECTURE_VERSION = "APP-8/2-journal-engine-arch" as const;

export const DECISION_JOURNAL_ENGINE_TAGS = Object.freeze([
  "[APP8_2]",
  "[DECISION_JOURNAL_ENGINE]",
  "[IMMUTABLE_ENTRIES]",
  "[APPEND_ONLY]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_ENGINE_MANDATORY_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "summary",
  "rationale",
  "assumptions",
  "alternatives",
  "evidenceReferences",
  "acceptedRisks",
  "expectedOutcome",
  "confidence",
  "tradeoffs",
  "constraints",
  "author",
  "reviewers",
  "tags",
  "metadata",
  "status",
  "source",
  "createdAt",
  "updatedAt",
  "contractVersion",
  "revisionVersion",
] as const);

export const DECISION_JOURNAL_UPDATABLE_FIELDS = Object.freeze([
  "title",
  "summary",
  "rationale",
  "assumptions",
  "alternatives",
  "evidenceReferences",
  "acceptedRisks",
  "expectedOutcome",
  "confidence",
  "tradeoffs",
  "constraints",
  "reviewers",
  "tags",
  "metadata",
  "status",
] as const);

export const DECISION_JOURNAL_IMMUTABLE_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "createdAt",
  "author",
  "source",
] as const);

export const DECISION_JOURNAL_LINK_IMMUTABLE_FIELDS = Object.freeze([
  "decisionId",
  "scenarioId",
] as const);

export const DECISION_JOURNAL_ENGINE_LIMITS = Object.freeze({
  maxPublishedEntries: 10_000,
  maxTagsPerEntry: 32,
  maxTagLength: 64,
  maxTitleLength: 256,
  maxSummaryLength: 1024,
  maxRationaleLength: 8192,
  maxExpectedOutcomeLength: 2048,
  maxAuthorLength: 128,
  maxListItemsPerField: 32,
  maxReviewersPerEntry: 16,
  maxMetadataKeys: 32,
  maxMetadataValueLength: 512,
} as const);

export const DECISION_JOURNAL_ENGINE_ERROR_CODES = Object.freeze({
  validationFailure: "validation_failure",
  duplicateEntry: "duplicate_entry",
  registryFull: "registry_full",
  engineNotInitialized: "engine_not_initialized",
  workspaceIsolation: "workspace_isolation",
  entryNotFound: "entry_not_found",
  forbiddenMutation: "forbidden_mutation",
  foundationIncompatible: "foundation_incompatible",
} as const);

export const DECISION_JOURNAL_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "scenario-timeline/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "JournalEditor",
  "JournalChart",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "prompt(",
] as const);

export type DecisionJournalEngineEntry = Readonly<{
  id: DecisionJournalEntryId;
  workspaceId: DecisionWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  title: string;
  summary: string;
  rationale: string;
  assumptions: readonly string[];
  alternatives: readonly string[];
  evidenceReferences: readonly string[];
  acceptedRisks: readonly string[];
  expectedOutcome: string;
  confidence: DecisionJournalConfidence;
  tradeoffs: readonly string[];
  constraints: readonly string[];
  author: string;
  reviewers: readonly string[];
  tags: readonly DecisionJournalTag[];
  metadata: DecisionJournalMetadata;
  status: DecisionJournalStatus;
  source: DecisionJournalSource;
  createdAt: string;
  updatedAt: string;
  contractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  revisionVersion: number;
  archived: boolean;
  readOnly: true;
}>;

export type CreateDecisionJournalEntryInput = Readonly<{
  id?: DecisionJournalEntryId;
  workspaceId: DecisionWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  title: string;
  summary: string;
  rationale: string;
  assumptions?: readonly string[];
  alternatives?: readonly string[];
  evidenceReferences?: readonly string[];
  acceptedRisks?: readonly string[];
  expectedOutcome: string;
  confidence: DecisionJournalConfidence;
  tradeoffs?: readonly string[];
  constraints?: readonly string[];
  author: string;
  reviewers?: readonly string[];
  tags?: readonly DecisionJournalTag[];
  metadata?: Readonly<Record<string, string>>;
  status?: DecisionJournalStatus;
  source: DecisionJournalSource;
  createdAt: string;
  updatedAt?: string;
}>;

export type NormalizedDecisionJournalEntryInput = Readonly<{
  id?: DecisionJournalEntryId;
  workspaceId: DecisionWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  title: string;
  summary: string;
  rationale: string;
  assumptions: readonly string[];
  alternatives: readonly string[];
  evidenceReferences: readonly string[];
  acceptedRisks: readonly string[];
  expectedOutcome: string;
  confidence: DecisionJournalConfidence;
  tradeoffs: readonly string[];
  constraints: readonly string[];
  author: string;
  reviewers: readonly string[];
  tags: readonly DecisionJournalTag[];
  metadata: DecisionJournalMetadata;
  status: DecisionJournalStatus;
  source: DecisionJournalSource;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateDecisionJournalMetadataInput = Readonly<{
  id: DecisionJournalEntryId;
  workspaceId: DecisionWorkspaceId;
  title?: string;
  summary?: string;
  rationale?: string;
  assumptions?: readonly string[];
  alternatives?: readonly string[];
  evidenceReferences?: readonly string[];
  acceptedRisks?: readonly string[];
  expectedOutcome?: string;
  confidence?: DecisionJournalConfidence;
  tradeoffs?: readonly string[];
  constraints?: readonly string[];
  reviewers?: readonly string[];
  tags?: readonly DecisionJournalTag[];
  metadata?: Readonly<Record<string, string>>;
  status?: DecisionJournalStatus;
  updatedAt?: string;
}>;

export type DecisionJournalEntryFilter = Readonly<{
  workspaceId: DecisionWorkspaceId;
  status?: DecisionJournalStatus;
  source?: DecisionJournalSource;
  confidence?: DecisionJournalConfidence;
  author?: string;
  reviewer?: string;
  tag?: DecisionJournalTag;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  includeArchived?: boolean;
}>;

export type DecisionJournalEngineState = Readonly<{
  engineId: "decision-journal-engine";
  contractVersion: typeof DECISION_JOURNAL_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  publishedEntryCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type DecisionJournalEntryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: DecisionJournalEngineError | null;
  readOnly: true;
}>;

export type DecisionJournalEngineRegistrySnapshot = Readonly<{
  registryVersion: string;
  publishedEntryCount: number;
  entryIds: readonly DecisionJournalEntryId[];
  readOnly: true;
}>;

export type DecisionJournalEngineCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalEngineCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalEngineCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export function createDecisionJournalEngineError(
  code: string,
  message: string,
  field?: string
): DecisionJournalEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function decisionJournalEngineErrorFromCode(
  code: keyof typeof DECISION_JOURNAL_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): DecisionJournalEngineError {
  return createDecisionJournalEngineError(DECISION_JOURNAL_ENGINE_ERROR_CODES[code], message, field);
}

export type { DecisionJournalValidationIssue, DecisionJournalValidationResult };
