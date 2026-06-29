/**
 * APP-7:6 — Business Timeline API domain types.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessLifecycleModel, BusinessLifecycleSummary } from "./businessTimelineLifecycleTypes.ts";
import type { BusinessMilestone } from "./businessTimelineLifecycleTypes.ts";
import type { BusinessTimelineContextModel } from "./businessTimelineContextTypes.ts";
import type { BusinessEventContext } from "./businessTimelineContextTypes.ts";
import type {
  BusinessTimelineQueryFilters,
  BusinessTimelineQueryResult,
  BusinessTimelineQuerySummary,
} from "./businessTimelineQueryTypes.ts";
import type { BusinessValidationIssue, BusinessValidationResult } from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_API_CONTRACT_VERSION = "APP-7/6" as const;
export const BUSINESS_TIMELINE_API_ARCHITECTURE_VERSION = "APP-7/6-api-consumer-arch" as const;

export const BUSINESS_TIMELINE_API_TAGS = Object.freeze([
  "[APP7_6]",
  "[BUSINESS_TIMELINE_API]",
  "[PUBLIC_FACADE]",
  "[CONSUMER_CONTRACTS]",
  "[NO_DIRECT_INTERNAL_IMPORTS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_TIMELINE_API_GROUP_KEYS = Object.freeze([
  "events",
  "query",
  "lifecycle",
  "context",
  "certification",
] as const);

export const BUSINESS_TIMELINE_CONSUMER_KEYS = Object.freeze([
  "DashboardConsumer",
  "AssistantConsumer",
  "WorkspaceConsumer",
  "VisualizationConsumer",
  "ReportConsumer",
  "ExportConsumer",
  "FutureAppConsumer",
] as const);

export const BUSINESS_TIMELINE_API_FORBIDDEN_PATTERNS = Object.freeze([
  "scenario-timeline/",
  "decision-timeline/",
  "components/",
  ".tsx",
  "BusinessChart",
  "TimelineRenderer",
  "DashboardAdapter",
  "AssistantAdapter",
] as const);

export const BUSINESS_TIMELINE_API_ERROR_CODES = Object.freeze({
  apiNotInitialized: "api_not_initialized",
  consumerForbidden: "consumer_forbidden",
  invalidConsumer: "invalid_consumer",
  invalidApiGroup: "invalid_api_group",
  mutationForbidden: "mutation_forbidden",
  prerequisiteFailure: "prerequisite_failure",
  validationFailure: "validation_failure",
} as const);

export type BusinessTimelineApiGroup = (typeof BUSINESS_TIMELINE_API_GROUP_KEYS)[number];
export type BusinessTimelineConsumerId = (typeof BUSINESS_TIMELINE_CONSUMER_KEYS)[number];

export type BusinessTimelineApiError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type BusinessTimelineApiResponse<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  errors: readonly BusinessTimelineApiError[];
  readOnly: true;
}>;

export type BusinessTimelineConsumerContract = Readonly<{
  consumerId: BusinessTimelineConsumerId;
  allowedApiGroups: readonly BusinessTimelineApiGroup[];
  forbiddenApiGroups: readonly BusinessTimelineApiGroup[];
  readOnly: boolean;
  mutationAllowed: boolean;
  compatibilityStatus: "compatible" | "restricted" | "forbidden";
  notes: string;
}>;

export type BusinessTimelineApiCapabilityManifest = Readonly<{
  platformId: string;
  platformName: string;
  version: typeof BUSINESS_TIMELINE_API_CONTRACT_VERSION;
  availableApiGroups: readonly BusinessTimelineApiGroup[];
  readCapabilities: readonly string[];
  writeCapabilities: readonly string[];
  forbiddenCapabilities: readonly string[];
  consumerCompatibility: readonly BusinessTimelineConsumerContract[];
  certifiedPrerequisites: readonly string[];
  directImportGuardNotes: string;
  generatedAt: string;
  readOnly: true;
}>;

export type BusinessTimelineApiEventsSurface = Readonly<{
  createEvent: (input: Parameters<typeof import("./businessEventEngine.ts").createBusinessEvent>[0]) => BusinessTimelineApiResponse<BusinessEngineEvent>;
  getEventById: (eventId: string) => BusinessTimelineApiResponse<BusinessEngineEvent | null>;
  getEventsByWorkspace: (workspaceId: string) => BusinessTimelineApiResponse<readonly BusinessEngineEvent[]>;
  updateEventMetadata: (
    input: Parameters<typeof import("./businessEventEngine.ts").updateBusinessEventMetadata>[0]
  ) => BusinessTimelineApiResponse<BusinessEngineEvent>;
  archiveEvent: (eventId: string, workspaceId: string) => BusinessTimelineApiResponse<BusinessEngineEvent>;
}>;

export type BusinessTimelineApiQuerySurface = Readonly<{
  queryTimeline: (filters: BusinessTimelineQueryFilters) => BusinessTimelineApiResponse<BusinessTimelineQueryResult>;
  getOrderedEvents: (filters: BusinessTimelineQueryFilters) => BusinessTimelineApiResponse<readonly BusinessEngineEvent[]>;
  getRange: (
    workspaceId: string,
    occurredFrom?: string,
    occurredTo?: string,
    direction?: BusinessTimelineQueryFilters["direction"]
  ) => BusinessTimelineApiResponse<BusinessTimelineQueryResult>;
  getSummary: (filters: BusinessTimelineQueryFilters) => BusinessTimelineApiResponse<BusinessTimelineQuerySummary>;
}>;

export type BusinessTimelineApiLifecycleSurface = Readonly<{
  buildLifecycle: (input: Parameters<typeof import("./businessTimelineLifecycle.ts").buildBusinessLifecycleModel>[0]) => BusinessTimelineApiResponse<BusinessLifecycleModel>;
  getLifecycleSummary: (
    input: Parameters<typeof import("./businessTimelineLifecycle.ts").buildBusinessLifecycleModel>[0]
  ) => BusinessTimelineApiResponse<BusinessLifecycleSummary>;
  extractMilestones: (
    input: Parameters<typeof import("./businessTimelineLifecycle.ts").buildBusinessLifecycleModel>[0]
  ) => BusinessTimelineApiResponse<readonly BusinessMilestone[]>;
}>;

export type BusinessTimelineApiContextSurface = Readonly<{
  buildContextModel: (
    input: Parameters<typeof import("./businessTimelineContext.ts").buildBusinessTimelineContextModel>[0]
  ) => BusinessTimelineApiResponse<BusinessTimelineContextModel>;
  getEventContext: (
    model: BusinessTimelineContextModel,
    eventId: string
  ) => BusinessTimelineApiResponse<BusinessEventContext | null>;
  getRelatedEvents: (
    model: BusinessTimelineContextModel,
    eventId: string
  ) => BusinessTimelineApiResponse<readonly BusinessEngineEvent[]>;
}>;

export type BusinessTimelineApiCertificationSurface = Readonly<{
  runCertification: () => BusinessTimelineApiResponse<BusinessTimelineApiCertificationResult>;
}>;

export type BusinessTimelineApi = Readonly<{
  events: BusinessTimelineApiEventsSurface;
  query: BusinessTimelineApiQuerySurface;
  lifecycle: BusinessTimelineApiLifecycleSurface;
  context: BusinessTimelineApiContextSurface;
  certification: BusinessTimelineApiCertificationSurface;
  version: typeof BUSINESS_TIMELINE_API_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BusinessTimelineApiEngineState = Readonly<{
  engineId: "business-timeline-api-layer";
  contractVersion: typeof BUSINESS_TIMELINE_API_CONTRACT_VERSION;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type BusinessTimelineConsumerAccessRequest = Readonly<{
  consumerId: BusinessTimelineConsumerId;
  apiGroup: BusinessTimelineApiGroup;
  operation: string;
  mutation: boolean;
}>;

export type BusinessTimelineApiCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessTimelineApiCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly BusinessTimelineApiCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { BusinessValidationIssue, BusinessValidationResult };

export function apiSuccess<T>(reason: string, data: T): BusinessTimelineApiResponse<T> {
  return Object.freeze({ success: true, reason, data, errors: Object.freeze([]), readOnly: true as const });
}

export function apiFailure<T>(reason: string, errors: readonly BusinessTimelineApiError[]): BusinessTimelineApiResponse<T> {
  return Object.freeze({ success: false, reason, data: null, errors: Object.freeze(errors), readOnly: true as const });
}

export function apiError(code: string, message: string, field?: string): BusinessTimelineApiError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
