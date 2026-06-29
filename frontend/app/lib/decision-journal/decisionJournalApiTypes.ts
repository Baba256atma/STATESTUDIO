/**
 * APP-8:7 — Decision Journal API domain types.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalEvidenceAssumptionModel,
  DecisionJournalEvidenceModel,
  DecisionJournalAssumptionModel,
  DecisionJournalQualityFlag,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import type {
  DecisionJournalQueryFilters,
  DecisionJournalQueryResult,
  DecisionJournalQuerySummary,
} from "./decisionJournalQueryTypes.ts";
import type {
  DecisionJournalReflectionModel,
  DecisionJournalInsightItem,
} from "./decisionJournalReflectionTypes.ts";
import type {
  DecisionJournalRetrospectiveModel,
  DecisionJournalOutcomeEvaluation,
} from "./decisionJournalRetrospectiveTypes.ts";
import type { DecisionJournalValidationIssue, DecisionJournalValidationResult } from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_API_CONTRACT_VERSION = "APP-8/7" as const;
export const DECISION_JOURNAL_API_ARCHITECTURE_VERSION = "APP-8/7-api-consumer-arch" as const;

export const DECISION_JOURNAL_API_TAGS = Object.freeze([
  "[APP8_7]",
  "[DECISION_JOURNAL_API]",
  "[PUBLIC_FACADE]",
  "[CONSUMER_CONTRACTS]",
  "[NO_DIRECT_INTERNAL_IMPORTS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_API_GROUP_KEYS = Object.freeze([
  "entries",
  "query",
  "reflection",
  "quality",
  "retrospective",
  "certification",
] as const);

export const DECISION_JOURNAL_CONSUMER_KEYS = Object.freeze([
  "WorkspaceConsumer",
  "DashboardConsumer",
  "AssistantConsumer",
  "VisualizationConsumer",
  "ReportConsumer",
  "ExportConsumer",
  "FutureAppConsumer",
] as const);

export const DECISION_JOURNAL_API_FORBIDDEN_PATTERNS = Object.freeze([
  "scenario-timeline/",
  "decision-timeline/",
  "components/",
  ".tsx",
  "DashboardAdapter",
  "AssistantAdapter",
  "VisualizationRenderer",
  "localStorage",
  "indexedDB",
] as const);

export const DECISION_JOURNAL_API_ERROR_CODES = Object.freeze({
  apiNotInitialized: "api_not_initialized",
  consumerForbidden: "consumer_forbidden",
  invalidConsumer: "invalid_consumer",
  invalidApiGroup: "invalid_api_group",
  mutationForbidden: "mutation_forbidden",
  prerequisiteFailure: "prerequisite_failure",
  validationFailure: "validation_failure",
  entryNotFound: "entry_not_found",
} as const);

export type DecisionJournalApiGroup = (typeof DECISION_JOURNAL_API_GROUP_KEYS)[number];
export type DecisionJournalConsumerId = (typeof DECISION_JOURNAL_CONSUMER_KEYS)[number];

export type DecisionJournalApiError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type DecisionJournalApiResponse<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  errors: readonly DecisionJournalApiError[];
  readOnly: true;
}>;

export type DecisionJournalConsumerContract = Readonly<{
  consumerId: DecisionJournalConsumerId;
  allowedApiGroups: readonly DecisionJournalApiGroup[];
  forbiddenApiGroups: readonly DecisionJournalApiGroup[];
  readOnly: boolean;
  mutationAllowed: boolean;
  compatibilityStatus: "compatible" | "restricted" | "forbidden";
  notes: string;
}>;

export type DecisionJournalApiCapabilityManifest = Readonly<{
  platformId: string;
  platformName: string;
  appId: string;
  version: typeof DECISION_JOURNAL_API_CONTRACT_VERSION;
  availableApiGroups: readonly DecisionJournalApiGroup[];
  readCapabilities: readonly string[];
  writeCapabilities: readonly string[];
  forbiddenCapabilities: readonly string[];
  consumerCompatibility: readonly DecisionJournalConsumerContract[];
  certifiedPrerequisites: readonly string[];
  directImportGuardNotes: string;
  generatedAt: string;
  readOnly: true;
}>;

export type DecisionJournalApiReflectionSummary = Readonly<{
  workspaceId: string;
  entryCount: number;
  insightCount: number;
  evidenceSummary: DecisionJournalReflectionModel["evidenceSummary"];
  confidenceSummary: DecisionJournalReflectionModel["confidenceSummary"];
  reviewSummary: DecisionJournalReflectionModel["reviewSummary"];
  generatedAt: string;
  readOnly: true;
}>;

export type DecisionJournalApiEntriesSurface = Readonly<{
  createEntry: (
    input: Parameters<typeof import("./decisionJournalEngine.ts").createDecisionJournalEntry>[0]
  ) => DecisionJournalApiResponse<DecisionJournalEngineEntry>;
  getEntryById: (entryId: string) => DecisionJournalApiResponse<DecisionJournalEngineEntry | null>;
  getEntries: (workspaceId: string) => DecisionJournalApiResponse<readonly DecisionJournalEngineEntry[]>;
  updateEntryMetadata: (
    input: Parameters<typeof import("./decisionJournalEngine.ts").updateDecisionJournalMetadata>[0]
  ) => DecisionJournalApiResponse<DecisionJournalEngineEntry>;
  archiveEntry: (
    entryId: string,
    workspaceId: string
  ) => DecisionJournalApiResponse<DecisionJournalEngineEntry>;
}>;

export type DecisionJournalApiQuerySurface = Readonly<{
  queryJournal: (filters: DecisionJournalQueryFilters) => DecisionJournalApiResponse<DecisionJournalQueryResult>;
  getOrderedEntries: (filters: DecisionJournalQueryFilters) => DecisionJournalApiResponse<readonly DecisionJournalEngineEntry[]>;
  getRange: (
    workspaceId: string,
    updatedAtFrom?: string,
    updatedAtTo?: string,
    direction?: DecisionJournalQueryFilters["direction"]
  ) => DecisionJournalApiResponse<DecisionJournalQueryResult>;
  getSummary: (filters: DecisionJournalQueryFilters) => DecisionJournalApiResponse<DecisionJournalQuerySummary>;
}>;

export type DecisionJournalApiReflectionSurface = Readonly<{
  buildReflection: (
    input: Parameters<typeof import("./decisionJournalReflection.ts").buildDecisionJournalReflectionModel>[0]
  ) => DecisionJournalApiResponse<DecisionJournalReflectionModel>;
  extractInsights: (
    input: Parameters<typeof import("./decisionJournalReflection.ts").buildDecisionJournalReflectionModel>[0]
  ) => DecisionJournalApiResponse<readonly DecisionJournalInsightItem[]>;
  getReflectionSummary: (
    input: Parameters<typeof import("./decisionJournalReflection.ts").buildDecisionJournalReflectionModel>[0]
  ) => DecisionJournalApiResponse<DecisionJournalApiReflectionSummary>;
}>;

export type DecisionJournalApiQualitySurface = Readonly<{
  buildEvidenceAssumptionModel: (
    input: Parameters<typeof import("./decisionJournalEvidenceAssumption.ts").buildDecisionJournalEvidenceAssumptionModel>[0]
  ) => DecisionJournalApiResponse<DecisionJournalEvidenceAssumptionModel>;
  evaluateEvidence: (entryId: string, workspaceId: string) => DecisionJournalApiResponse<DecisionJournalEvidenceModel>;
  evaluateAssumptions: (entryId: string, workspaceId: string) => DecisionJournalApiResponse<DecisionJournalAssumptionModel>;
  detectQualityFlags: (
    input: Parameters<typeof import("./decisionJournalEvidenceAssumption.ts").buildDecisionJournalEvidenceAssumptionModel>[0]
  ) => DecisionJournalApiResponse<readonly DecisionJournalQualityFlag[]>;
}>;

export type DecisionJournalApiRetrospectiveSurface = Readonly<{
  buildRetrospectiveModel: (
    input: Parameters<typeof import("./decisionJournalRetrospective.ts").buildDecisionJournalRetrospectiveModel>[0]
  ) => DecisionJournalApiResponse<DecisionJournalRetrospectiveModel>;
  evaluateOutcome: (entryId: string, workspaceId: string) => DecisionJournalApiResponse<DecisionJournalOutcomeEvaluation>;
  evaluateRetrospective: (
    entryId: string,
    workspaceId: string
  ) => DecisionJournalApiResponse<DecisionJournalRetrospectiveModel>;
}>;

export type DecisionJournalApiCertificationSurface = Readonly<{
  runCertification: () => DecisionJournalApiResponse<DecisionJournalApiCertificationResult>;
}>;

export type DecisionJournalApi = Readonly<{
  entries: DecisionJournalApiEntriesSurface;
  query: DecisionJournalApiQuerySurface;
  reflection: DecisionJournalApiReflectionSurface;
  quality: DecisionJournalApiQualitySurface;
  retrospective: DecisionJournalApiRetrospectiveSurface;
  certification: DecisionJournalApiCertificationSurface;
  version: typeof DECISION_JOURNAL_API_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionJournalApiEngineState = Readonly<{
  engineId: "decision-journal-api-layer";
  contractVersion: typeof DECISION_JOURNAL_API_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalConsumerAccessRequest = Readonly<{
  consumerId: DecisionJournalConsumerId;
  apiGroup: DecisionJournalApiGroup;
  operation: string;
  mutation: boolean;
}>;

export type DecisionJournalApiCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalApiCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionJournalApiCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionJournalValidationIssue, DecisionJournalValidationResult };

export function apiSuccess<T>(reason: string, data: T): DecisionJournalApiResponse<T> {
  return Object.freeze({ success: true, reason, data, errors: Object.freeze([]), readOnly: true as const });
}

export function apiFailure<T>(reason: string, errors: readonly DecisionJournalApiError[]): DecisionJournalApiResponse<T> {
  return Object.freeze({ success: false, reason, data: null, errors: Object.freeze(errors), readOnly: true as const });
}

export function apiError(code: string, message: string, field?: string): DecisionJournalApiError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
