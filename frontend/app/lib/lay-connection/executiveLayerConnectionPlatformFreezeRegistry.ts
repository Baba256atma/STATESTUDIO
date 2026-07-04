import type {
  ExecutiveLayerConnectionExtensionPolicy,
  ExecutiveLayerConnectionPhaseRegistryEntry,
  ExecutiveLayerConnectionPlatformFreeze,
  ExecutiveLayerConnectionPublicApiEntry,
  ExecutiveLayerConnectionReleaseMetadata,
} from "./executiveLayerConnectionPlatformFreezeTypes.ts";

export const EXECUTIVE_LAYER_CONNECTION_FREEZE_PLATFORM_ID = "executive-layer-connection-platform-freeze";
export const EXECUTIVE_LAYER_CONNECTION_FREEZE_VERSION = "LAY-CONN-12";

export const EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA: ExecutiveLayerConnectionReleaseMetadata = Object.freeze({
  platformId: EXECUTIVE_LAYER_CONNECTION_FREEZE_PLATFORM_ID,
  platformVersion: "LAY-CONN-12",
  releaseStage: "Certified Frozen Release",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY: ExecutiveLayerConnectionExtensionPolicy = Object.freeze({
  policyId: "lay-conn-platform-freeze-extension-policy",
  extensionMode: "additive-only",
  certifiedPhaseMutationAllowed: false,
  runtimeBehaviorAllowed: false,
  orchestrationAllowed: false,
  executionLogicAllowed: false,
});

export const EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY: readonly ExecutiveLayerConnectionPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({ phaseId: "LAY-CONN-1", name: "Layer Connection Contracts", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-2", name: "Reasoning Judgment Bridge", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-3", name: "Judgment Recommendation Bridge", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-4", name: "Judgment Explanation Bridge", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-5", name: "Awareness Context Aggregator", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-6", name: "Attention Signal Platform", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-7", name: "Executive Priority Signal Platform", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-8", name: "Executive Blind Spot Bridge", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-9", name: "Assistant Dashboard Connection API", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-10", name: "Scene EVE Signal Bridge", required: true, certified: true }),
  Object.freeze({ phaseId: "LAY-CONN-11", name: "Type-C Runtime Integration", required: true, certified: true }),
] as const);

export const EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY: readonly ExecutiveLayerConnectionPublicApiEntry[] = Object.freeze([
  Object.freeze({ apiName: "ExecutiveLayerConnectionPlatformFreeze", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "buildExecutiveLayerConnectionFreezeManifest", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "runExecutiveLayerConnectionCertification", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "runExecutiveLayerConnectionRegression", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "runExecutiveLayerConnectionFreeze", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "getExecutiveLayerConnectionFreezeState", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "listExecutiveLayerConnectionPhases", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "listExecutiveLayerConnectionPublicApis", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "getExecutiveLayerConnectionCompatibilityMatrix", phaseId: "LAY-CONN-12", stable: true }),
  Object.freeze({ apiName: "getExecutiveLayerConnectionExtensionPolicy", phaseId: "LAY-CONN-12", stable: true }),
] as const);

export function listExecutiveLayerConnectionPhases(): readonly ExecutiveLayerConnectionPhaseRegistryEntry[] {
  return EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY;
}

export function listExecutiveLayerConnectionPublicApis(): readonly ExecutiveLayerConnectionPublicApiEntry[] {
  return EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY;
}

export function getExecutiveLayerConnectionExtensionPolicy(): ExecutiveLayerConnectionExtensionPolicy {
  return EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY;
}

export const ExecutiveLayerConnectionPlatformFreeze: ExecutiveLayerConnectionPlatformFreeze = Object.freeze({
  platformId: EXECUTIVE_LAYER_CONNECTION_FREEZE_PLATFORM_ID,
  releaseMetadata: EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA,
  phaseRegistry: EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY,
  publicApiRegistry: EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY,
  compatibilityMatrix: Object.freeze([] as const),
  extensionPolicy: EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY,
});
