/**
 * APP-9:7 — Confidence Evolution API domain types.
 */

import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";
import type { ConfidenceEvidenceReasonLinkModel } from "./confidenceEvolutionEvidenceReasonTypes.ts";
import type {
  ConfidenceEvolutionQueryFilters,
  ConfidenceEvolutionQueryResult,
  ConfidenceEvolutionQuerySummary,
} from "./confidenceEvolutionQueryTypes.ts";
import type { ConfidenceEvolutionTrendModel } from "./confidenceEvolutionTrendTypes.ts";
import type { ConfidenceCalibrationModel } from "./confidenceEvolutionCalibrationTypes.ts";
import type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult } from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION = "APP-9/7" as const;
export const CONFIDENCE_EVOLUTION_API_ARCHITECTURE_VERSION = "APP-9/7-api-consumer-arch" as const;

export const CONFIDENCE_EVOLUTION_API_TAGS = Object.freeze([
  "[APP9_7]",
  "[CONFIDENCE_EVOLUTION_API]",
  "[PUBLIC_FACADE]",
  "[CONSUMER_CONTRACTS]",
  "[NO_DIRECT_INTERNAL_IMPORTS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_EVOLUTION_API_GROUP_KEYS = Object.freeze([
  "records",
  "query",
  "trend",
  "evidenceReason",
  "calibration",
  "certification",
] as const);

export const CONFIDENCE_EVOLUTION_CONSUMER_KEYS = Object.freeze([
  "WorkspaceConsumer",
  "DashboardConsumer",
  "AssistantConsumer",
  "VisualizationConsumer",
  "ReportConsumer",
  "ExportConsumer",
  "FutureAppConsumer",
] as const);

export const CONFIDENCE_EVOLUTION_API_FORBIDDEN_PATTERNS = Object.freeze([
  "decision-timeline/",
  "business-timeline/",
  "decision-journal/",
  "scenario-timeline/",
  "components/",
  ".tsx",
  "DashboardAdapter",
  "AssistantAdapter",
  "VisualizationRenderer",
  "ConfidenceChart",
  "localStorage",
  "indexedDB",
] as const);

export const CONFIDENCE_EVOLUTION_API_ERROR_CODES = Object.freeze({
  apiNotInitialized: "api_not_initialized",
  consumerForbidden: "consumer_forbidden",
  invalidConsumer: "invalid_consumer",
  invalidApiGroup: "invalid_api_group",
  mutationForbidden: "mutation_forbidden",
  prerequisiteFailure: "prerequisite_failure",
  validationFailure: "validation_failure",
  recordNotFound: "record_not_found",
} as const);

export type ConfidenceEvolutionApiGroup = (typeof CONFIDENCE_EVOLUTION_API_GROUP_KEYS)[number];
export type ConfidenceEvolutionConsumerId = (typeof CONFIDENCE_EVOLUTION_CONSUMER_KEYS)[number];

export type ConfidenceEvolutionApiError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionApiResponse<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  errors: readonly ConfidenceEvolutionApiError[];
  readOnly: true;
}>;

export type ConfidenceEvolutionConsumerContract = Readonly<{
  consumerId: ConfidenceEvolutionConsumerId;
  allowedApiGroups: readonly ConfidenceEvolutionApiGroup[];
  forbiddenApiGroups: readonly ConfidenceEvolutionApiGroup[];
  readOnly: boolean;
  mutationAllowed: boolean;
  compatibilityStatus: "compatible" | "restricted" | "forbidden";
  notes: string;
}>;

export type ConfidenceEvolutionApiCapabilityManifest = Readonly<{
  platformId: string;
  platformName: string;
  appId: string;
  version: typeof CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION;
  availableApiGroups: readonly ConfidenceEvolutionApiGroup[];
  readCapabilities: readonly string[];
  writeCapabilities: readonly string[];
  forbiddenCapabilities: readonly string[];
  consumerCompatibility: readonly ConfidenceEvolutionConsumerContract[];
  certifiedPrerequisites: readonly string[];
  directImportGuardNotes: string;
  generatedAt: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionApiRecordsSurface = Readonly<{
  createRecord: (
    input: Parameters<typeof import("./confidenceEvolutionEngine.ts").createConfidenceRecord>[0]
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionEngineRecord>;
  getRecordById: (recordId: string) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionEngineRecord | null>;
  getRecords: (workspaceId: string) => ConfidenceEvolutionApiResponse<readonly ConfidenceEvolutionEngineRecord[]>;
  updateRecordMetadata: (
    input: Parameters<typeof import("./confidenceEvolutionEngine.ts").updateConfidenceMetadata>[0]
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionEngineRecord>;
  archiveRecord: (
    recordId: string,
    workspaceId: string
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionEngineRecord>;
}>;

export type ConfidenceEvolutionApiQuerySurface = Readonly<{
  queryConfidence: (filters: ConfidenceEvolutionQueryFilters) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionQueryResult>;
  getOrderedRecords: (filters: ConfidenceEvolutionQueryFilters) => ConfidenceEvolutionApiResponse<readonly ConfidenceEvolutionEngineRecord[]>;
  getRange: (
    workspaceId: string,
    updatedAtFrom?: string,
    updatedAtTo?: string,
    direction?: ConfidenceEvolutionQueryFilters["direction"]
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionQueryResult>;
  getSummary: (filters: ConfidenceEvolutionQueryFilters) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionQuerySummary>;
}>;

export type ConfidenceEvolutionApiTrendSurface = Readonly<{
  buildTrendModel: (
    input: Parameters<typeof import("./confidenceEvolutionTrend.ts").buildConfidenceTrendModel>[0]
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvolutionTrendModel>;
  calculateDeltas: (workspaceId: string) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionDeltas.ts").calculateConfidenceDeltas>>;
  calculateVolatility: (workspaceId: string) => ConfidenceEvolutionApiResponse<number>;
  classifyDirection: (workspaceId: string) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionTrendClassification.ts").classifyConfidenceTrendDirection>>;
}>;

export type ConfidenceEvolutionApiEvidenceReasonSurface = Readonly<{
  buildEvidenceReasonModel: (
    input: Parameters<typeof import("./confidenceEvolutionEvidenceReason.ts").buildConfidenceEvidenceReasonLinkModel>[0]
  ) => ConfidenceEvolutionApiResponse<ConfidenceEvidenceReasonLinkModel>;
  buildReasonLinks: (workspaceId: string) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionReasonLinks.ts").buildConfidenceReasonLinks>>;
  buildEvidenceLinks: (workspaceId: string) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionEvidenceLinks.ts").buildConfidenceEvidenceLinks>>;
  detectExplanationFlags: (workspaceId: string) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionExplanationFlags.ts").detectConfidenceExplanationFlags>>;
}>;

export type ConfidenceEvolutionApiCalibrationSurface = Readonly<{
  buildCalibrationModel: (
    input: Parameters<typeof import("./confidenceEvolutionCalibration.ts").buildConfidenceCalibrationModel>[0]
  ) => ConfidenceEvolutionApiResponse<ConfidenceCalibrationModel>;
  evaluateCalibration: (
    confidenceScore: number,
    reason: ConfidenceEvolutionEngineRecord["reason"],
    source: ConfidenceEvolutionEngineRecord["source"],
    evidenceReferences: readonly string[]
  ) => ConfidenceEvolutionApiResponse<ReturnType<typeof import("./confidenceEvolutionCalibrationScoring.ts").evaluateConfidenceCalibration>>;
  calculateCalibrationScore: (
    confidenceScore: number,
    evidenceSupportScore: number
  ) => ConfidenceEvolutionApiResponse<number>;
  calculateAccuracyScore: (
    confidenceScore: number,
    evidenceSupportScore: number
  ) => ConfidenceEvolutionApiResponse<number>;
}>;

export type ConfidenceEvolutionApiCertificationSurface = Readonly<{
  runCertification: () => ConfidenceEvolutionApiResponse<ConfidenceEvolutionApiCertificationResult>;
}>;

export type ConfidenceEvolutionApi = Readonly<{
  records: ConfidenceEvolutionApiRecordsSurface;
  query: ConfidenceEvolutionApiQuerySurface;
  trend: ConfidenceEvolutionApiTrendSurface;
  evidenceReason: ConfidenceEvolutionApiEvidenceReasonSurface;
  calibration: ConfidenceEvolutionApiCalibrationSurface;
  certification: ConfidenceEvolutionApiCertificationSurface;
  version: typeof CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ConfidenceEvolutionApiEngineState = Readonly<{
  engineId: "confidence-evolution-api-layer";
  contractVersion: typeof CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionConsumerAccessRequest = Readonly<{
  consumerId: ConfidenceEvolutionConsumerId;
  apiGroup: ConfidenceEvolutionApiGroup;
  operation: string;
  mutation: boolean;
}>;

export type ConfidenceEvolutionApiCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionApiCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly ConfidenceEvolutionApiCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { ConfidenceEvolutionValidationIssue, ConfidenceEvolutionValidationResult };

export function apiSuccess<T>(reason: string, data: T): ConfidenceEvolutionApiResponse<T> {
  return Object.freeze({ success: true, reason, data, errors: Object.freeze([]), readOnly: true as const });
}

export function apiFailure<T>(
  reason: string,
  errors: readonly ConfidenceEvolutionApiError[]
): ConfidenceEvolutionApiResponse<T> {
  return Object.freeze({ success: false, reason, data: null, errors: Object.freeze(errors), readOnly: true as const });
}

export function apiError(code: string, message: string, field?: string): ConfidenceEvolutionApiError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
