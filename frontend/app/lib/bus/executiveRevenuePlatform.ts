import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContractRegistry,
  ExecutiveRevenueContractTypes,
  ExecutiveRevenueContractVersion,
  ExecutiveRevenueContracts,
  ExecutiveRevenuePlatformDescription,
} from "./executiveRevenueContracts.ts";
import {
  ExecutiveRevenueDriverRegistry,
  ExecutiveRevenueForecastRegistry,
  ExecutiveRevenueMetricRegistry,
  ExecutiveRevenueOpportunityRegistry,
  ExecutiveRevenueRegistry,
  ExecutiveRevenueRegistryDescription,
  ExecutiveRevenueRegistryId,
  ExecutiveRevenueRegistryNamespace,
  ExecutiveRevenueRegistryVersion,
  ExecutiveRevenueRiskRegistry,
  ExecutiveRevenueSourceRegistry,
  ExecutiveRevenueStreamRegistry,
  ExecutiveRevenueSummaryRegistry,
  ExecutiveRevenueTargetRegistry,
} from "./executiveRevenueRegistry.ts";
import {
  ExecutiveRevenueModel,
  ExecutiveRevenueModelDependencyGraph,
  ExecutiveRevenueModelFoundation,
  ExecutiveRevenueModelId,
  ExecutiveRevenueModelNamespace,
  ExecutiveRevenueModelRelationships,
  ExecutiveRevenueModelVersion,
} from "./executiveRevenueModel.ts";
import {
  ExecutiveRevenueValidationFoundation,
  ExecutiveRevenueValidationId,
  ExecutiveRevenueValidationNamespace,
  ExecutiveRevenueValidationResult,
  ExecutiveRevenueValidationVersion,
} from "./executiveRevenueValidation.ts";
import {
  ExecutiveRevenueManifest,
  ExecutiveRevenueManifestCompatibility,
  ExecutiveRevenueManifestDependencies,
  ExecutiveRevenueManifestFoundation,
  ExecutiveRevenueManifestId,
  ExecutiveRevenueManifestNamespace,
  ExecutiveRevenueManifestPublicSurface,
  ExecutiveRevenueManifestVersion,
} from "./executiveRevenueManifest.ts";

export const ExecutiveRevenuePlatformId = "executive-revenue-platform" as const;

export const ExecutiveRevenuePlatformVersion = "1.0.0" as const;

export const ExecutiveRevenuePlatformNamespace =
  `${ExecutiveRevenueContractNamespace}.platform` as const;

export { ExecutiveRevenuePlatformDescription } from "./executiveRevenueContracts.ts";

export const ExecutiveRevenuePlatformDependencies = Object.freeze({
  contracts: Object.freeze({
    phaseId: "BUS-29:1",
    namespace: ExecutiveRevenueContractNamespace,
    version: ExecutiveRevenueContractVersion,
    publicApiCount: ExecutiveRevenueContractRegistry.publicApis.length,
    metadataOnly: true,
    immutable: true,
  }),
  registry: Object.freeze({
    phaseId: "BUS-29:2",
    registryId: ExecutiveRevenueRegistryId,
    namespace: ExecutiveRevenueRegistryNamespace,
    version: ExecutiveRevenueRegistryVersion,
    registryCount: 9,
    metadataOnly: true,
    immutable: true,
  }),
  model: Object.freeze({
    phaseId: "BUS-29:3",
    modelId: ExecutiveRevenueModelId,
    namespace: ExecutiveRevenueModelNamespace,
    version: ExecutiveRevenueModelVersion,
    dependencyNodeCount: ExecutiveRevenueModelDependencyGraph.nodes.length,
    dependencyEdgeCount: ExecutiveRevenueModelDependencyGraph.edges.length,
    metadataOnly: true,
    immutable: true,
  }),
  validation: Object.freeze({
    phaseId: "BUS-29:4",
    validationId: ExecutiveRevenueValidationId,
    namespace: ExecutiveRevenueValidationNamespace,
    version: ExecutiveRevenueValidationVersion,
    structurallyComplete: ExecutiveRevenueValidationResult.structurallyComplete,
    metadataOnly: true,
    immutable: true,
  }),
  manifest: Object.freeze({
    phaseId: "BUS-29:5",
    manifestId: ExecutiveRevenueManifestId,
    namespace: ExecutiveRevenueManifestNamespace,
    version: ExecutiveRevenueManifestVersion,
    publicSurfaceCount:
      ExecutiveRevenueManifestPublicSurface.contracts.length +
      ExecutiveRevenueManifestPublicSurface.registry.length +
      ExecutiveRevenueManifestPublicSurface.model.length +
      ExecutiveRevenueManifestPublicSurface.validation.length +
      ExecutiveRevenueManifestPublicSurface.manifest.length,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenuePlatformPublicApi = Object.freeze([
  "ExecutiveRevenuePlatformId",
  "ExecutiveRevenuePlatformVersion",
  "ExecutiveRevenuePlatformNamespace",
  "ExecutiveRevenuePlatformDescription",
  "ExecutiveRevenuePlatformDependencies",
  "ExecutiveRevenuePlatformPublicApi",
  "ExecutiveRevenuePlatformFoundation",
] as const);

export const ExecutiveRevenuePlatformFoundation = Object.freeze({
  contracts: Object.freeze({
    platform: ExecutiveRevenueContracts,
    contractTypes: ExecutiveRevenueContractTypes,
    contractRegistry: ExecutiveRevenueContractRegistry,
    metadataOnly: true,
    immutable: true,
  }),
  registry: Object.freeze({
    registryId: ExecutiveRevenueRegistryId,
    registryVersion: ExecutiveRevenueRegistryVersion,
    registryNamespace: ExecutiveRevenueRegistryNamespace,
    registryDescription: ExecutiveRevenueRegistryDescription,
    sourceRegistry: ExecutiveRevenueSourceRegistry,
    streamRegistry: ExecutiveRevenueStreamRegistry,
    metricRegistry: ExecutiveRevenueMetricRegistry,
    driverRegistry: ExecutiveRevenueDriverRegistry,
    opportunityRegistry: ExecutiveRevenueOpportunityRegistry,
    riskRegistry: ExecutiveRevenueRiskRegistry,
    forecastRegistry: ExecutiveRevenueForecastRegistry,
    targetRegistry: ExecutiveRevenueTargetRegistry,
    summaryRegistry: ExecutiveRevenueSummaryRegistry,
    registry: ExecutiveRevenueRegistry,
    metadataOnly: true,
    immutable: true,
  }),
  model: Object.freeze({
    modelId: ExecutiveRevenueModelId,
    modelVersion: ExecutiveRevenueModelVersion,
    modelNamespace: ExecutiveRevenueModelNamespace,
    relationships: ExecutiveRevenueModelRelationships,
    dependencyGraph: ExecutiveRevenueModelDependencyGraph,
    foundation: ExecutiveRevenueModelFoundation,
    model: ExecutiveRevenueModel,
    metadataOnly: true,
    immutable: true,
  }),
  validation: Object.freeze({
    validationId: ExecutiveRevenueValidationId,
    validationVersion: ExecutiveRevenueValidationVersion,
    validationNamespace: ExecutiveRevenueValidationNamespace,
    validationResult: ExecutiveRevenueValidationResult,
    foundation: ExecutiveRevenueValidationFoundation,
    metadataOnly: true,
    immutable: true,
  }),
  manifest: Object.freeze({
    manifestId: ExecutiveRevenueManifestId,
    manifestVersion: ExecutiveRevenueManifestVersion,
    manifestNamespace: ExecutiveRevenueManifestNamespace,
    manifestDependencies: ExecutiveRevenueManifestDependencies,
    manifestCompatibility: ExecutiveRevenueManifestCompatibility,
    manifestPublicSurface: ExecutiveRevenueManifestPublicSurface,
    foundation: ExecutiveRevenueManifestFoundation,
    manifest: ExecutiveRevenueManifest,
    metadataOnly: true,
    immutable: true,
  }),
  platform: Object.freeze({
    platformId: ExecutiveRevenuePlatformId,
    platformVersion: ExecutiveRevenuePlatformVersion,
    platformNamespace: ExecutiveRevenuePlatformNamespace,
    platformDescription: ExecutiveRevenuePlatformDescription,
    dependencies: ExecutiveRevenuePlatformDependencies,
    publicApi: ExecutiveRevenuePlatformPublicApi,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});
