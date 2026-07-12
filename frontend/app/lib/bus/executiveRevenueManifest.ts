import {
  ExecutiveRevenueContractNamespace,
  ExecutiveRevenueContractRegistry,
  ExecutiveRevenueContractVersion,
  ExecutiveRevenueContracts,
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
  ExecutiveRevenueModelDescription,
  ExecutiveRevenueModelFoundation,
  ExecutiveRevenueModelId,
  ExecutiveRevenueModelNamespace,
  ExecutiveRevenueModelRelationships,
  ExecutiveRevenueModelVersion,
} from "./executiveRevenueModel.ts";
import {
  ExecutiveRevenueValidationDescription,
  ExecutiveRevenueValidationFoundation,
  ExecutiveRevenueValidationId,
  ExecutiveRevenueValidationNamespace,
  ExecutiveRevenueValidationResult,
  ExecutiveRevenueValidationVersion,
} from "./executiveRevenueValidation.ts";

export const ExecutiveRevenueManifestId = "executive-revenue-manifest" as const;

export const ExecutiveRevenueManifestVersion = "1.0.0" as const;

export const ExecutiveRevenueManifestNamespace =
  `${ExecutiveRevenueContractNamespace}.manifest` as const;

export const ExecutiveRevenueManifestDescription =
  "Canonical metadata-only manifest layer for executive revenue intelligence." as const;

export const ExecutiveRevenueManifestDependencies = Object.freeze({
  contracts: Object.freeze({
    phaseId: "BUS-29:1",
    module: "Executive Revenue Intelligence Contracts",
    namespace: ExecutiveRevenueContractNamespace,
    version: ExecutiveRevenueContractVersion,
    publicSurface: Object.freeze(ExecutiveRevenueContractRegistry.publicApis),
    metadataOnly: true,
    immutable: true,
  }),
  registry: Object.freeze({
    phaseId: "BUS-29:2",
    module: "Executive Revenue Intelligence Registry",
    registryId: ExecutiveRevenueRegistryId,
    namespace: ExecutiveRevenueRegistryNamespace,
    version: ExecutiveRevenueRegistryVersion,
    description: ExecutiveRevenueRegistryDescription,
    publicSurface: Object.freeze([
      "ExecutiveRevenueSourceRegistry",
      "ExecutiveRevenueStreamRegistry",
      "ExecutiveRevenueMetricRegistry",
      "ExecutiveRevenueDriverRegistry",
      "ExecutiveRevenueOpportunityRegistry",
      "ExecutiveRevenueRiskRegistry",
      "ExecutiveRevenueForecastRegistry",
      "ExecutiveRevenueTargetRegistry",
      "ExecutiveRevenueSummaryRegistry",
      "ExecutiveRevenueRegistry",
    ] as const),
    metadataOnly: true,
    immutable: true,
  }),
  model: Object.freeze({
    phaseId: "BUS-29:3",
    module: "Executive Revenue Intelligence Model",
    modelId: ExecutiveRevenueModelId,
    namespace: ExecutiveRevenueModelNamespace,
    version: ExecutiveRevenueModelVersion,
    description: ExecutiveRevenueModelDescription,
    publicSurface: Object.freeze([
      "ExecutiveRevenueModelRelationships",
      "ExecutiveRevenueModelDependencyGraph",
      "ExecutiveRevenueModel",
      "ExecutiveRevenueModelFoundation",
    ] as const),
    metadataOnly: true,
    immutable: true,
  }),
  validation: Object.freeze({
    phaseId: "BUS-29:4",
    module: "Executive Revenue Intelligence Validation",
    validationId: ExecutiveRevenueValidationId,
    namespace: ExecutiveRevenueValidationNamespace,
    version: ExecutiveRevenueValidationVersion,
    description: ExecutiveRevenueValidationDescription,
    publicSurface: Object.freeze([
      "ExecutiveRevenueValidationChecklist",
      "ExecutiveRevenueValidationRules",
      "ExecutiveRevenueValidationMatrix",
      "ExecutiveRevenueValidationResult",
      "ExecutiveRevenueValidationFoundation",
    ] as const),
    metadataOnly: true,
    immutable: true,
  }),
  dependencyGraph: Object.freeze({
    source: ExecutiveRevenueModelId,
    nodes: ExecutiveRevenueModelDependencyGraph.nodes.length,
    edges: ExecutiveRevenueModelDependencyGraph.edges.length,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueManifestPublicSurface = Object.freeze({
  contracts: Object.freeze(ExecutiveRevenueContractRegistry.publicApis),
  registry: Object.freeze([
    "ExecutiveRevenueRegistryId",
    "ExecutiveRevenueRegistryVersion",
    "ExecutiveRevenueRegistryNamespace",
    "ExecutiveRevenueRegistryDescription",
    "ExecutiveRevenueSourceRegistry",
    "ExecutiveRevenueStreamRegistry",
    "ExecutiveRevenueMetricRegistry",
    "ExecutiveRevenueDriverRegistry",
    "ExecutiveRevenueOpportunityRegistry",
    "ExecutiveRevenueRiskRegistry",
    "ExecutiveRevenueForecastRegistry",
    "ExecutiveRevenueTargetRegistry",
    "ExecutiveRevenueSummaryRegistry",
    "ExecutiveRevenueRegistry",
  ] as const),
  model: Object.freeze([
    "ExecutiveRevenueModelId",
    "ExecutiveRevenueModelVersion",
    "ExecutiveRevenueModelNamespace",
    "ExecutiveRevenueModelDescription",
    "ExecutiveRevenueModelRelationships",
    "ExecutiveRevenueModelDependencyGraph",
    "ExecutiveRevenueModel",
    "ExecutiveRevenueModelFoundation",
  ] as const),
  validation: Object.freeze([
    "ExecutiveRevenueValidationId",
    "ExecutiveRevenueValidationVersion",
    "ExecutiveRevenueValidationNamespace",
    "ExecutiveRevenueValidationDescription",
    "ExecutiveRevenueValidationChecklist",
    "ExecutiveRevenueValidationRules",
    "ExecutiveRevenueValidationMatrix",
    "ExecutiveRevenueValidationResult",
    "ExecutiveRevenueValidationFoundation",
  ] as const),
  manifest: Object.freeze([
    "ExecutiveRevenueManifestId",
    "ExecutiveRevenueManifestVersion",
    "ExecutiveRevenueManifestNamespace",
    "ExecutiveRevenueManifestDescription",
    "ExecutiveRevenueManifestDependencies",
    "ExecutiveRevenueManifestPublicSurface",
    "ExecutiveRevenueManifestCompatibility",
    "ExecutiveRevenueManifest",
    "ExecutiveRevenueManifestFoundation",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueManifestCompatibility = Object.freeze({
  contractsToRegistry:
    ExecutiveRevenueRegistryNamespace.startsWith(ExecutiveRevenueContractNamespace),
  registryToModel:
    ExecutiveRevenueModelNamespace.startsWith(ExecutiveRevenueContractNamespace) &&
    ExecutiveRevenueModelDependencyGraph.nodes.length >=
      ExecutiveRevenueSourceRegistry.length +
        ExecutiveRevenueStreamRegistry.length +
        ExecutiveRevenueMetricRegistry.length +
        ExecutiveRevenueDriverRegistry.length +
        ExecutiveRevenueOpportunityRegistry.length +
        ExecutiveRevenueRiskRegistry.length +
        ExecutiveRevenueForecastRegistry.length +
        ExecutiveRevenueTargetRegistry.length +
        ExecutiveRevenueSummaryRegistry.length,
  modelToValidation:
    ExecutiveRevenueValidationNamespace.startsWith(ExecutiveRevenueContractNamespace) &&
    ExecutiveRevenueValidationResult.structurallyComplete,
  publicSurfaceIntegrity:
    ExecutiveRevenueManifestPublicSurface.contracts.length > 0 &&
    ExecutiveRevenueManifestPublicSurface.registry.length > 0 &&
    ExecutiveRevenueManifestPublicSurface.model.length > 0 &&
    ExecutiveRevenueManifestPublicSurface.validation.length > 0 &&
    ExecutiveRevenueManifestPublicSurface.manifest.length > 0,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueManifest = Object.freeze({
  manifestId: ExecutiveRevenueManifestId,
  manifestVersion: ExecutiveRevenueManifestVersion,
  manifestNamespace: ExecutiveRevenueManifestNamespace,
  manifestDescription: ExecutiveRevenueManifestDescription,
  platformIdentity: ExecutiveRevenueContracts,
  contractSurface: ExecutiveRevenueContractRegistry,
  registrySurface: Object.freeze({
    registry: ExecutiveRevenueRegistry,
    sourceCount: ExecutiveRevenueSourceRegistry.length,
    streamCount: ExecutiveRevenueStreamRegistry.length,
    metricCount: ExecutiveRevenueMetricRegistry.length,
    driverCount: ExecutiveRevenueDriverRegistry.length,
    opportunityCount: ExecutiveRevenueOpportunityRegistry.length,
    riskCount: ExecutiveRevenueRiskRegistry.length,
    forecastCount: ExecutiveRevenueForecastRegistry.length,
    targetCount: ExecutiveRevenueTargetRegistry.length,
    summaryCount: ExecutiveRevenueSummaryRegistry.length,
    metadataOnly: true,
    immutable: true,
  }),
  modelSurface: Object.freeze({
    model: ExecutiveRevenueModel,
    relationshipGroups: Object.freeze({
      sourceToStream: ExecutiveRevenueModelRelationships.sourceToStream.length,
      streamToMetric: ExecutiveRevenueModelRelationships.streamToMetric.length,
      metricToDriver: ExecutiveRevenueModelRelationships.metricToDriver.length,
      driverToOpportunity: ExecutiveRevenueModelRelationships.driverToOpportunity.length,
      driverToRisk: ExecutiveRevenueModelRelationships.driverToRisk.length,
      forecastToTarget: ExecutiveRevenueModelRelationships.forecastToTarget.length,
      targetToSummary: ExecutiveRevenueModelRelationships.targetToSummary.length,
    }),
    dependencyGraph: Object.freeze({
      nodes: ExecutiveRevenueModelDependencyGraph.nodes.length,
      edges: ExecutiveRevenueModelDependencyGraph.edges.length,
    }),
    foundation: ExecutiveRevenueModelFoundation,
    metadataOnly: true,
    immutable: true,
  }),
  validationSurface: Object.freeze({
    foundation: ExecutiveRevenueValidationFoundation,
    structurallyComplete: ExecutiveRevenueValidationResult.structurallyComplete,
    passedChecks: ExecutiveRevenueValidationResult.matrix.passedChecks,
    failedChecks: ExecutiveRevenueValidationResult.matrix.failedChecks,
    metadataOnly: true,
    immutable: true,
  }),
  dependencyGraph: ExecutiveRevenueModelDependencyGraph,
  publicExportSurface: ExecutiveRevenueManifestPublicSurface,
  dependencies: ExecutiveRevenueManifestDependencies,
  compatibility: ExecutiveRevenueManifestCompatibility,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueManifestFoundation = Object.freeze({
  ExecutiveRevenueManifestId,
  ExecutiveRevenueManifestVersion,
  ExecutiveRevenueManifestNamespace,
  ExecutiveRevenueManifestDescription,
  ExecutiveRevenueManifestDependencies,
  ExecutiveRevenueManifestPublicSurface,
  ExecutiveRevenueManifestCompatibility,
  ExecutiveRevenueManifest,
  metadataOnly: true,
  immutable: true,
});
