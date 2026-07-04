import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import { AppDomainContextLayer } from "./appDomainContextIndex.ts";
import type {
  AppDomainPlatformExtensionPolicy,
  AppDomainPlatformIdentity,
  AppDomainPlatformPhaseRegistryEntry,
  AppDomainPlatformPublicApiEntry,
  AppDomainPlatformReleaseMetadata,
} from "./appDomainPlatformFreezeTypes.ts";

export const APP_DOMAIN_PLATFORM_IDENTITY: AppDomainPlatformIdentity = Object.freeze({
  platformId: "nexora-app-domain-consumer-platform",
  platformName: "Nexora APP-DOM Consumer Platform",
  layerId: "APP-DOM",
  version: "APP-DOM-4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const APP_DOMAIN_PHASE_REGISTRY: readonly AppDomainPlatformPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({ phaseId: "APP-DOM-1", title: "Domain Expertise Consumer Bridge", status: "certified", order: 1, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-DOM-2", title: "Domain Expertise Mapping Layer", status: "certified", order: 2, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-DOM-3", title: "Domain Context Selection Layer", status: "certified", order: 3, metadataOnly: true }),
  Object.freeze({ phaseId: "APP-DOM-4", title: "Domain Consumer Platform Certification & Freeze", status: "frozen", order: 4, metadataOnly: true }),
]);

export const APP_DOMAIN_RELEASE_METADATA: AppDomainPlatformReleaseMetadata = Object.freeze({
  releaseId: "app-dom-consumer-platform-freeze",
  releaseName: "APP-DOM Consumer Platform Certification & Freeze",
  releaseVersion: "APP-DOM-4",
  certificationDependency: "APP-DOM-1 through APP-DOM-3",
  regressionDependency: "APP-DOM regression",
  immutable: true,
  deterministic: true,
});

export const APP_DOMAIN_EXTENSION_POLICY: AppDomainPlatformExtensionPolicy = Object.freeze({
  allowsNewConsumerUtilities: true,
  allowsExecutiveReasoning: false,
  allowsRecommendations: false,
  allowsDecisionEngine: false,
  allowsInference: false,
  allowsSimulation: false,
  allowsPlanning: false,
  allowsOptimization: false,
  allowsRanking: false,
  allowsScoring: false,
  allowsAiLogic: false,
  allowsLlmPrompting: false,
  allowsRuntimeExecution: false,
  allowsRuntimeMutation: false,
  allowsDomainMutations: false,
  requiresPublicApiConsumption: true,
  policy: "metadata-consumer-extension-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "AppDomainPlatformFreeze",
  "buildAppDomainPlatformManifest",
  "isAppDomainPlatformManifestValid",
  "runAppDomainPlatformCertification",
  "runAppDomainPlatformRegression",
  "runAppDomainPlatformFreeze",
  "getAppDomainPlatformFreezeState",
  "getAppDomainPlatformCompatibilityMatrix",
  "isAppDomainPlatformCompatibilityMatrixValid",
  "listAppDomainPlatformPhases",
  "listAppDomainPlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  phaseId: AppDomainPlatformPublicApiEntry["phaseId"],
  category: AppDomainPlatformPublicApiEntry["category"]
): AppDomainPlatformPublicApiEntry {
  return Object.freeze({ apiName, phaseId, category, stable: true, metadataOnly: true });
}

export const APP_DOMAIN_PUBLIC_API_REGISTRY: readonly AppDomainPlatformPublicApiEntry[] = Object.freeze([
  ...Object.keys(AppDomainBridge).map((apiName) => apiEntry(apiName, "APP-DOM-1", "bridge")),
  ...Object.keys(AppDomainMappingLayer).map((apiName) => apiEntry(apiName, "APP-DOM-2", "mapping")),
  ...Object.keys(AppDomainContextLayer).map((apiName) => apiEntry(apiName, "APP-DOM-3", "context")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "APP-DOM-4", "freeze")),
]);

export function listAppDomainPlatformPhases(): readonly AppDomainPlatformPhaseRegistryEntry[] {
  return APP_DOMAIN_PHASE_REGISTRY;
}

export function listAppDomainPlatformPublicApis(): readonly AppDomainPlatformPublicApiEntry[] {
  return APP_DOMAIN_PUBLIC_API_REGISTRY;
}
