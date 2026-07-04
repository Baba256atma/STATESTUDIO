import type {
  ExecutiveKpiCapability,
  ExecutiveKpiDependency,
  ExecutiveKpiExtensionPolicy,
  ExecutiveKpiPlatformRegistry,
  ExecutiveKpiPublicApi,
} from "./executiveKpiPlatformTypes.ts";

export const EXECUTIVE_KPI_DEPENDENCIES: readonly ExecutiveKpiDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "CORE", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "DS", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "INT", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "KNL", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "APP", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "LAY", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "OPS", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_KPI_CAPABILITIES: readonly ExecutiveKpiCapability[] = Object.freeze([
  Object.freeze({ capabilityId: "kpi-registry", name: "KPI Registry", description: "Declares future KPI registry metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-definitions", name: "KPI Definitions", description: "Declares future KPI definition metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-categories", name: "KPI Categories", description: "Declares future KPI category metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-ownership", name: "KPI Ownership", description: "Declares future KPI ownership metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-metadata", name: "KPI Metadata", description: "Declares future KPI metadata contracts.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-lifecycle", name: "KPI Lifecycle", description: "Declares future KPI lifecycle metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-validation", name: "KPI Validation", description: "Declares future KPI validation metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-catalog", name: "KPI Catalog", description: "Declares future KPI catalog metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-contracts", name: "KPI Contracts", description: "Declares future KPI contract metadata.", declarationOnly: true }),
  Object.freeze({ capabilityId: "kpi-extension", name: "KPI Extension", description: "Declares additive extension metadata.", declarationOnly: true }),
] as const);

export const EXECUTIVE_KPI_PUBLIC_APIS: readonly ExecutiveKpiPublicApi[] = Object.freeze([
  Object.freeze({ apiName: "ExecutiveKpiPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveKpiPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveKpiPlatformManifest", stable: true, runtime: false }),
  Object.freeze({ apiName: "validateExecutiveKpiPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveKpiCapabilities", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveKpiPublicApis", stable: true, runtime: false }),
] as const);

export const EXECUTIVE_KPI_EXTENSION_POLICY: ExecutiveKpiExtensionPolicy = Object.freeze({
  policyId: "executive-kpi-foundation-extension-policy",
  extensionMode: "additive-only",
  foundationMutationAllowed: false,
  runtimeExecutionAllowed: false,
  businessLogicAllowed: false,
});

export const EXECUTIVE_KPI_PLATFORM_REGISTRY: ExecutiveKpiPlatformRegistry = Object.freeze({
  platformName: "Executive KPI Platform",
  platformId: "BUS-1",
  version: "1.0.0",
  description: "Immutable metadata foundation for the Executive KPI Platform.",
  lifecycle: Object.freeze({
    status: "Foundation",
    state: "Immutable",
    certificationStatus: "BUS-1 Foundation",
  }),
  dependencies: EXECUTIVE_KPI_DEPENDENCIES,
  consumers: Object.freeze([
    Object.freeze({ consumerId: "app-consumer", name: "APP Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "lay-consumer", name: "LAY Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "ops-consumer", name: "OPS Consumer", metadataOnly: true }),
  ] as const),
  capabilities: EXECUTIVE_KPI_CAPABILITIES,
  publicApis: EXECUTIVE_KPI_PUBLIC_APIS,
  releaseMetadata: Object.freeze({
    releaseId: "BUS-1",
    releaseStage: "Foundation",
    metadataOnly: true,
    immutable: true,
  }),
  extensionPolicy: EXECUTIVE_KPI_EXTENSION_POLICY,
});

export function listExecutiveKpiCapabilities(): readonly ExecutiveKpiCapability[] {
  return EXECUTIVE_KPI_CAPABILITIES;
}

export function listExecutiveKpiPublicApis(): readonly ExecutiveKpiPublicApi[] {
  return EXECUTIVE_KPI_PUBLIC_APIS;
}
