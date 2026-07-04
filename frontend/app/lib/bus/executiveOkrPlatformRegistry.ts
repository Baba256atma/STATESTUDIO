import type {
  ExecutiveOkrCapability,
  ExecutiveOkrDependency,
  ExecutiveOkrExtensionPolicy,
  ExecutiveOkrPlatformRegistry,
  ExecutiveOkrPublicApi,
} from "./executiveOkrPlatformTypes.ts";

export const EXECUTIVE_OKR_DEPENDENCIES: readonly ExecutiveOkrDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "CORE", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "DS", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "INT", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "KNL", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "APP", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "LAY", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "OPS", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "EVE", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS Executive KPI Platform", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_OKR_CAPABILITIES: readonly ExecutiveOkrCapability[] = Object.freeze([
  Object.freeze({ capabilityId: "okr-registry", name: "OKR Registry", description: "Declares future OKR registry metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "objective-definitions", name: "Objective Definitions", description: "Declares future objective definition metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "key-result-definitions", name: "Key Result Definitions", description: "Declares future key result definition metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-ownership", name: "OKR Ownership", description: "Declares future OKR ownership metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-lifecycle", name: "OKR Lifecycle", description: "Declares future OKR lifecycle metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-alignment-metadata", name: "OKR Alignment Metadata", description: "Declares future OKR alignment metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-governance-metadata", name: "OKR Governance Metadata", description: "Declares future OKR governance metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-review-metadata", name: "OKR Review Metadata", description: "Declares future OKR review metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-kpi-linkage-metadata", name: "OKR KPI Linkage Metadata", description: "Declares future OKR to KPI linkage metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "okr-extension", name: "OKR Extension", description: "Declares additive OKR extension metadata.", declarationOnly: true }),
] as const);

export const EXECUTIVE_OKR_PUBLIC_APIS: readonly ExecutiveOkrPublicApi[] = Object.freeze([
  Object.freeze({ apiName: "ExecutiveOkrPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveOkrPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveOkrPlatformManifest", stable: true, runtime: false }),
  Object.freeze({ apiName: "validateExecutiveOkrPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveOkrCapabilities", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveOkrPublicApis", stable: true, runtime: false }),
] as const);

export const EXECUTIVE_OKR_EXTENSION_POLICY: ExecutiveOkrExtensionPolicy = Object.freeze({
  policyId: "executive-okr-foundation-extension-policy",
  extensionMode: "additive-only",
  foundationMutationAllowed: false,
  runtimeExecutionAllowed: false,
  businessLogicAllowed: false,
  okrScoringAllowed: false,
  progressCalculationAllowed: false,
});

export const EXECUTIVE_OKR_PLATFORM_REGISTRY: ExecutiveOkrPlatformRegistry = Object.freeze({
  platformName: "Executive OKR Platform",
  platformId: "BUS-13",
  version: "1.0.0",
  description: "Immutable metadata foundation for the Executive OKR Platform.",
  lifecycle: Object.freeze({
    status: "Foundation",
    state: "Immutable",
    certificationStatus: "BUS-13 Foundation",
  }),
  dependencies: EXECUTIVE_OKR_DEPENDENCIES,
  consumers: Object.freeze([
    Object.freeze({ consumerId: "app-okr-consumer", name: "APP OKR Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "lay-okr-consumer", name: "LAY OKR Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "ops-okr-consumer", name: "OPS OKR Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "bus-kpi-consumer", name: "BUS KPI Consumer", metadataOnly: true }),
  ] as const),
  capabilities: EXECUTIVE_OKR_CAPABILITIES,
  publicApis: EXECUTIVE_OKR_PUBLIC_APIS,
  releaseMetadata: Object.freeze({
    releaseId: "BUS-13",
    releaseStage: "Foundation",
    metadataOnly: true,
    immutable: true,
  }),
  extensionPolicy: EXECUTIVE_OKR_EXTENSION_POLICY,
  kpiPlatformFreezeDependency: "Executive KPI Platform Freeze",
});

export function listExecutiveOkrCapabilities(): readonly ExecutiveOkrCapability[] {
  return EXECUTIVE_OKR_CAPABILITIES;
}

export function listExecutiveOkrPublicApis(): readonly ExecutiveOkrPublicApi[] {
  return EXECUTIVE_OKR_PUBLIC_APIS;
}
