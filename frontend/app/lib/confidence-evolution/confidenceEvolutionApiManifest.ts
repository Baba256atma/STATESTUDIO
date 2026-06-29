/**
 * APP-9:7 — Confidence Evolution API capability manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ID,
  CONFIDENCE_EVOLUTION_PLATFORM_NAME,
} from "./confidenceEvolutionConstants.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
import { CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST } from "./confidenceEvolutionCalibration.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_API_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_API_TAGS,
  type ConfidenceEvolutionApiCapabilityManifest,
} from "./confidenceEvolutionApiTypes.ts";
import { listConfidenceEvolutionConsumerContracts } from "./confidenceEvolutionConsumerContracts.ts";

export const CONFIDENCE_EVOLUTION_API_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_API_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_API_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/7",
  title: "Confidence API + Consumer Contract Layer",
  goal: "Official public API facade and consumer contracts for APP-9 Confidence Evolution platform access.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApiTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApiFacade.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApiManifest.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionConsumerContracts.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionConsumerValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApiValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApi.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApiRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionApi.test.ts",
    "docs/app-9-7-confidence-api-consumer-contract.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_API_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2", "APP-9/3", "APP-9/4", "APP-9/5", "APP-9/6"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_API_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_DIRECT_IMPORT_GUARD_NOTES = Object.freeze(
  "Future Workspace, Dashboard, Assistant, Visualization, Report, and Export consumers MUST import APP-9:7 public APIs only. Direct imports from confidenceEvolutionEngine, confidenceEvolutionQuery, confidenceEvolutionTrend, confidenceEvolutionEvidenceReason, or confidenceEvolutionCalibration internal modules are forbidden."
);

export const CONFIDENCE_EVOLUTION_API_READ_CAPABILITIES = Object.freeze([
  "getRecordById",
  "getRecords",
  "queryConfidence",
  "getOrderedRecords",
  "getRange",
  "getSummary",
  "buildTrendModel",
  "calculateDeltas",
  "calculateVolatility",
  "classifyDirection",
  "buildEvidenceReasonModel",
  "buildReasonLinks",
  "buildEvidenceLinks",
  "detectExplanationFlags",
  "buildCalibrationModel",
  "evaluateCalibration",
  "calculateCalibrationScore",
  "calculateAccuracyScore",
  "runCertification",
] as const);

export const CONFIDENCE_EVOLUTION_API_WRITE_CAPABILITIES = Object.freeze([
  "createRecord",
  "updateRecordMetadata",
  "archiveRecord",
] as const);

export const CONFIDENCE_EVOLUTION_API_FORBIDDEN_CAPABILITIES = Object.freeze([
  "directInternalModuleImport",
  "dashboardRendering",
  "assistantPrompting",
  "visualizationRendering",
  "persistence",
  "app6Integration",
  "app7Integration",
  "app8Integration",
  "decisionTimelineCoupling",
  "businessTimelineCoupling",
  "decisionJournalCoupling",
] as const);

export const CONFIDENCE_EVOLUTION_API_CERTIFIED_PREREQUISITES = Object.freeze([
  "APP-9/1",
  "APP-9/2",
  "APP-9/3",
  "APP-9/4",
  "APP-9/5",
  "APP-9/6",
] as const);

export const CONFIDENCE_EVOLUTION_API_PUBLIC_RULES = Object.freeze({
  facadeOnly: true,
  noDirectInternalImports: true,
  consumerContractsRequired: true,
  readOnlyConsumersEnforced: true,
  controlledWriteThroughFacade: true,
  noDashboardImplementation: true,
  noAssistantImplementation: true,
  noVisualizationImplementation: true,
  noPersistence: true,
  noApp678Integration: true,
} as const);

export function buildConfidenceEvolutionApiManifest(generatedAt: string): ConfidenceEvolutionApiCapabilityManifest {
  return Object.freeze({
    platformId: CONFIDENCE_EVOLUTION_PLATFORM_ID,
    platformName: CONFIDENCE_EVOLUTION_PLATFORM_NAME,
    appId: CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId,
    version: CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
    availableApiGroups: CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
    readCapabilities: CONFIDENCE_EVOLUTION_API_READ_CAPABILITIES,
    writeCapabilities: CONFIDENCE_EVOLUTION_API_WRITE_CAPABILITIES,
    forbiddenCapabilities: CONFIDENCE_EVOLUTION_API_FORBIDDEN_CAPABILITIES,
    consumerCompatibility: listConfidenceEvolutionConsumerContracts(),
    certifiedPrerequisites: CONFIDENCE_EVOLUTION_API_CERTIFIED_PREREQUISITES,
    directImportGuardNotes: CONFIDENCE_EVOLUTION_DIRECT_IMPORT_GUARD_NOTES,
    generatedAt,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionApiManifest = Object.freeze({
  buildConfidenceEvolutionApiManifest,
  directImportGuardNotes: CONFIDENCE_EVOLUTION_DIRECT_IMPORT_GUARD_NOTES,
});
