/**
 * APP-7:6 — Business Timeline API capability manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ID,
  BUSINESS_TIMELINE_PLATFORM_NAME,
} from "./businessTimelineConstants.ts";
import { BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST } from "./businessTimelineContext.ts";
import {
  BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  BUSINESS_TIMELINE_API_FORBIDDEN_PATTERNS,
  BUSINESS_TIMELINE_API_GROUP_KEYS,
  BUSINESS_TIMELINE_API_TAGS,
  type BusinessTimelineApiCapabilityManifest,
} from "./businessTimelineApiTypes.ts";
import { listBusinessTimelineConsumerContracts } from "./businessTimelineConsumerContracts.ts";

export const BUSINESS_TIMELINE_API_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_TIMELINE_API_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_TIMELINE_API_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/6",
  title: "Business Timeline API + Consumer Contract Layer",
  goal: "Official public API facade and consumer contracts for APP-7 Business Timeline platform access.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelineApiTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelineApiFacade.ts",
    "frontend/app/lib/business-timeline/businessTimelineApiManifest.ts",
    "frontend/app/lib/business-timeline/businessTimelineConsumerContracts.ts",
    "frontend/app/lib/business-timeline/businessTimelineConsumerValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineApiValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineApi.ts",
    "frontend/app/lib/business-timeline/businessTimelineApiRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelineApi.test.ts",
    "docs/app-7-6-business-timeline-api-consumer-contract.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_API_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-7/1", "APP-7/2", "APP-7/3", "APP-7/4", "APP-7/5"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_API_TAGS,
} satisfies StageManifest);

export const BUSINESS_TIMELINE_DIRECT_IMPORT_GUARD_NOTES = Object.freeze(
  "Future Dashboard, Assistant, Workspace, Visualization, Report, and Export consumers MUST import APP-7:6 public APIs only. Direct imports from businessEventEngine, businessTimelineQuery, businessTimelineLifecycle, or businessTimelineContext internal modules are forbidden."
);

export const BUSINESS_TIMELINE_API_READ_CAPABILITIES = Object.freeze([
  "queryTimeline",
  "getOrderedEvents",
  "getRange",
  "getSummary",
  "buildLifecycle",
  "getLifecycleSummary",
  "extractMilestones",
  "buildContextModel",
  "getEventContext",
  "getRelatedEvents",
  "getEventById",
  "getEventsByWorkspace",
  "runCertification",
] as const);

export const BUSINESS_TIMELINE_API_WRITE_CAPABILITIES = Object.freeze([
  "createEvent",
  "updateEventMetadata",
  "archiveEvent",
] as const);

export const BUSINESS_TIMELINE_API_FORBIDDEN_CAPABILITIES = Object.freeze([
  "directInternalModuleImport",
  "dashboardRendering",
  "assistantPrompting",
  "visualizationRendering",
  "dataSourceIngestion",
  "scenarioTimelineCoupling",
  "decisionTimelineCoupling",
] as const);

export const BUSINESS_TIMELINE_API_CERTIFIED_PREREQUISITES = Object.freeze([
  "APP-7/1",
  "APP-7/2",
  "APP-7/3",
  "APP-7/4",
  "APP-7/5",
] as const);

export const BUSINESS_TIMELINE_API_PUBLIC_RULES = Object.freeze({
  facadeOnly: true,
  noDirectInternalImports: true,
  consumerContractsRequired: true,
  readOnlyConsumersEnforced: true,
  controlledWriteThroughFacade: true,
  noDashboardImplementation: true,
  noAssistantImplementation: true,
  noVisualizationImplementation: true,
} as const);

export function buildBusinessTimelineApiManifest(generatedAt: string): BusinessTimelineApiCapabilityManifest {
  return Object.freeze({
    platformId: BUSINESS_TIMELINE_PLATFORM_ID,
    platformName: BUSINESS_TIMELINE_PLATFORM_NAME,
    version: BUSINESS_TIMELINE_API_CONTRACT_VERSION,
    availableApiGroups: BUSINESS_TIMELINE_API_GROUP_KEYS,
    readCapabilities: BUSINESS_TIMELINE_API_READ_CAPABILITIES,
    writeCapabilities: BUSINESS_TIMELINE_API_WRITE_CAPABILITIES,
    forbiddenCapabilities: BUSINESS_TIMELINE_API_FORBIDDEN_CAPABILITIES,
    consumerCompatibility: listBusinessTimelineConsumerContracts(),
    certifiedPrerequisites: BUSINESS_TIMELINE_API_CERTIFIED_PREREQUISITES,
    directImportGuardNotes: BUSINESS_TIMELINE_DIRECT_IMPORT_GUARD_NOTES,
    generatedAt,
    readOnly: true as const,
  });
}

export const BusinessTimelineApiManifest = Object.freeze({
  buildBusinessTimelineApiManifest,
  directImportGuardNotes: BUSINESS_TIMELINE_DIRECT_IMPORT_GUARD_NOTES,
});
