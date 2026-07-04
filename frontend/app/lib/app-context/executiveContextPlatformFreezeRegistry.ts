import {
  EXECUTIVE_CONTEXT_BUILDER_PUBLIC_APIS,
  EXECUTIVE_CONTEXT_CERTIFICATION_PUBLIC_APIS,
  EXECUTIVE_CONTEXT_QUERY_PUBLIC_APIS,
} from "./executiveContextCertificationIndex.ts";
import type {
  ExecutiveContextPlatformExtensionPolicy,
  ExecutiveContextPlatformIdentity,
  ExecutiveContextPlatformPhaseRegistryEntry,
  ExecutiveContextPlatformPublicApiEntry,
  ExecutiveContextPlatformReleaseMetadata,
} from "./executiveContextPlatformFreezeTypes.ts";

export const EXECUTIVE_CONTEXT_PLATFORM_IDENTITY: ExecutiveContextPlatformIdentity = Object.freeze({
  platformId: "nexora-executive-context-platform",
  platformName: "Nexora Executive Context Platform",
  layerId: "APP-CTX",
  version: "APP-CTX-4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const EXECUTIVE_CONTEXT_PHASE_REGISTRY: readonly ExecutiveContextPlatformPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({ phaseId: "APP-CTX-1", title: "Executive Context Builder", status: "certified", order: 1, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-CTX-2", title: "Executive Context Query", status: "certified", order: 2, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-CTX-3", title: "Executive Context Certification & Export", status: "certified", order: 3, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-CTX-4", title: "Executive Context Platform Freeze", status: "frozen", order: 4, metadataOnly: true }),
]);

export const EXECUTIVE_CONTEXT_RELEASE_METADATA: ExecutiveContextPlatformReleaseMetadata = Object.freeze({
  releaseId: "app-ctx-executive-context-platform-freeze",
  releaseName: "APP-CTX Executive Context Platform Freeze",
  releaseVersion: "APP-CTX-4",
  certificationDependency: "APP-CTX-3",
  regressionDependency: "APP-CTX regression",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_CONTEXT_EXTENSION_POLICY: ExecutiveContextPlatformExtensionPolicy = Object.freeze({
  allowsNewContextSections: true,
  allowsNewInspectionUtilities: true,
  allowsExecutiveReasoning: false,
  allowsRecommendations: false,
  allowsDecisionEngine: false,
  allowsJudgment: false,
  allowsScenarioGeneration: false,
  allowsSimulationExecution: false,
  allowsPlanning: false,
  allowsOptimization: false,
  allowsRanking: false,
  allowsScoring: false,
  allowsInference: false,
  allowsLlmPrompting: false,
  allowsAiLogic: false,
  allowsAutomaticAnalysis: false,
  allowsRuntimeExecution: false,
  allowsRuntimeMutation: false,
  requiresPublicApiConsumption: true,
  policy: "immutable-context-metadata-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "ExecutiveContextPlatformFreeze",
  "buildExecutiveContextPlatformFreezeManifest",
  "isExecutiveContextPlatformFreezeManifestValid",
  "runExecutiveContextPlatformFreeze",
  "getExecutiveContextPlatformFreezeState",
  "getExecutiveContextPlatformCompatibilityMatrix",
  "isExecutiveContextPlatformCompatibilityMatrixValid",
  "listExecutiveContextPlatformPhases",
  "listExecutiveContextPlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  phaseId: ExecutiveContextPlatformPublicApiEntry["phaseId"],
  category: ExecutiveContextPlatformPublicApiEntry["category"]
): ExecutiveContextPlatformPublicApiEntry {
  return Object.freeze({ apiName, phaseId, category, stable: true, metadataOnly: true });
}

export const EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY: readonly ExecutiveContextPlatformPublicApiEntry[] = Object.freeze([
  ...EXECUTIVE_CONTEXT_BUILDER_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-CTX-1", "builder")),
  ...EXECUTIVE_CONTEXT_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-CTX-2", "query")),
  ...EXECUTIVE_CONTEXT_CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-CTX-3", "certification")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-CTX-4", "freeze")),
]);

export function listExecutiveContextPlatformPhases(): readonly ExecutiveContextPlatformPhaseRegistryEntry[] {
  return EXECUTIVE_CONTEXT_PHASE_REGISTRY;
}

export function listExecutiveContextPlatformPublicApis(): readonly ExecutiveContextPlatformPublicApiEntry[] {
  return EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY;
}
