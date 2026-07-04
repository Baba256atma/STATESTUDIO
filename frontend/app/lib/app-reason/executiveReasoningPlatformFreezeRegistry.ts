import type {
  ExecutiveReasoningPlatformExtensionPolicy,
  ExecutiveReasoningPlatformIdentity,
  ExecutiveReasoningPlatformPhaseRegistryEntry,
  ExecutiveReasoningPlatformPublicApiEntry,
  ExecutiveReasoningPlatformReleaseMetadata,
} from "./executiveReasoningPlatformFreezeTypes.ts";

export const EXECUTIVE_REASONING_PLATFORM_IDENTITY: ExecutiveReasoningPlatformIdentity = Object.freeze({
  platformId: "nexora-executive-reasoning-platform",
  platformName: "Nexora Executive Reasoning Platform",
  layerId: "APP-REASON",
  version: "APP-REASON-4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const EXECUTIVE_REASONING_PHASE_REGISTRY: readonly ExecutiveReasoningPlatformPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({ phaseId: "APP-REASON-1", title: "Executive Reasoning Foundation", status: "certified", order: 1, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-REASON-2", title: "Executive Reasoning Query", status: "certified", order: 2, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-REASON-3", title: "Executive Reasoning Certification & Export", status: "certified", order: 3, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-REASON-4", title: "Executive Reasoning Platform Freeze", status: "frozen", order: 4, metadataOnly: true }),
]);

export const EXECUTIVE_REASONING_RELEASE_METADATA: ExecutiveReasoningPlatformReleaseMetadata = Object.freeze({
  releaseId: "app-reason-executive-reasoning-platform-freeze",
  releaseName: "APP-REASON Executive Reasoning Platform Freeze",
  releaseVersion: "APP-REASON-4",
  certificationDependency: "APP-REASON-3",
  regressionDependency: "APP-REASON regression",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_REASONING_EXTENSION_POLICY: ExecutiveReasoningPlatformExtensionPolicy = Object.freeze({
  allowsNewReasoningContracts: true,
  allowsNewInspectionUtilities: true,
  allowsExecutiveReasoningExecution: false,
  allowsRecommendations: false,
  allowsDecisionMaking: false,
  allowsJudgment: false,
  allowsPlanning: false,
  allowsOptimization: false,
  allowsRanking: false,
  allowsScoring: false,
  allowsInference: false,
  allowsAnalysis: false,
  allowsSimulation: false,
  allowsScenarioGeneration: false,
  allowsLlmPrompting: false,
  allowsAiLogic: false,
  allowsAutomaticConclusions: false,
  allowsRuntimeExecution: false,
  allowsRuntimeMutation: false,
  requiresPublicApiConsumption: true,
  policy: "immutable-reasoning-metadata-only",
});

const FOUNDATION_PUBLIC_APIS = Object.freeze([
  "ExecutiveReasoningFoundation",
  "createExecutiveReasoningRegistry",
  "registerExecutiveReasoningPackage",
  "unregisterExecutiveReasoningPackage",
  "getExecutiveReasoningPackage",
  "listExecutiveReasoningPackages",
  "hasExecutiveReasoningPackage",
  "freezeExecutiveReasoningRegistry",
  "validateExecutiveReasoningFoundation",
  "validateExecutiveReasoningPackage",
  "validateExecutiveReasoningRegistration",
  "validateExecutiveReasoningRegistry",
  "buildExecutiveReasoningManifest",
  "validateExecutiveReasoningManifest",
] as const);

const QUERY_PUBLIC_APIS = Object.freeze([
  "ExecutiveReasoningQueryLayer",
  "queryExecutiveReasoningPackages",
  "filterExecutiveReasoningPackages",
  "sortExecutiveReasoningPackages",
  "findReasoningPackagesByDomain",
  "findReasoningPackagesByScope",
  "findReasoningPackagesByStatus",
  "findReasoningPackageContainingContract",
  "findExecutiveReasoningContract",
  "findReasoningInputs",
  "findReasoningOutputs",
  "findReasoningEvidence",
  "findReasoningAssumptions",
  "findReasoningConstraints",
  "findReasoningConfidenceMetadata",
  "findReasoningTraceMetadata",
  "inspectExecutiveReasoningPackage",
  "listExecutiveReasoningCapabilities",
  "buildExecutiveReasoningSummary",
  "buildExecutiveReasoningSnapshot",
  "validateExecutiveReasoningSnapshot",
  "compareExecutiveReasoningSnapshots",
  "diffExecutiveReasoningSnapshots",
] as const);

const CERTIFICATION_PUBLIC_APIS = Object.freeze([
  "ExecutiveReasoningCertificationLayer",
  "buildExecutiveReasoningExportBundle",
  "validateExecutiveReasoningExportBundle",
  "compareExecutiveReasoningExportBundles",
  "runExecutiveReasoningCertification",
  "runExecutiveReasoningRegression",
  "listExecutiveReasoningRegressionApiCoverage",
] as const);

const FREEZE_PUBLIC_APIS = Object.freeze([
  "ExecutiveReasoningPlatformFreeze",
  "buildExecutiveReasoningPlatformFreezeManifest",
  "isExecutiveReasoningPlatformFreezeManifestValid",
  "runExecutiveReasoningPlatformFreeze",
  "getExecutiveReasoningPlatformFreezeState",
  "getExecutiveReasoningPlatformCompatibilityMatrix",
  "isExecutiveReasoningPlatformCompatibilityMatrixValid",
  "listExecutiveReasoningPlatformPhases",
  "listExecutiveReasoningPlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  phaseId: ExecutiveReasoningPlatformPublicApiEntry["phaseId"],
  category: ExecutiveReasoningPlatformPublicApiEntry["category"]
): ExecutiveReasoningPlatformPublicApiEntry {
  return Object.freeze({ apiName, phaseId, category, stable: true, metadataOnly: true });
}

export const EXECUTIVE_REASONING_PUBLIC_API_REGISTRY: readonly ExecutiveReasoningPlatformPublicApiEntry[] = Object.freeze([
  ...FOUNDATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-REASON-1", "foundation")),
  ...QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-REASON-2", "query")),
  ...CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-REASON-3", "certification")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-REASON-4", "freeze")),
]);

export function listExecutiveReasoningPlatformPhases(): readonly ExecutiveReasoningPlatformPhaseRegistryEntry[] {
  return EXECUTIVE_REASONING_PHASE_REGISTRY;
}

export function listExecutiveReasoningPlatformPublicApis(): readonly ExecutiveReasoningPlatformPublicApiEntry[] {
  return EXECUTIVE_REASONING_PUBLIC_API_REGISTRY;
}
