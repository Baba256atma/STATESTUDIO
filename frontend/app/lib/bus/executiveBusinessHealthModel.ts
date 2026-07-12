import {
  ExecutiveBusinessHealthContractDescription,
  ExecutiveBusinessHealthContractId,
  ExecutiveBusinessHealthContractName,
  ExecutiveBusinessHealthContractVersion,
  type ExecutiveBusinessHealthCapability,
  type ExecutiveBusinessHealthContract,
  type ExecutiveBusinessHealthDimension,
  type ExecutiveBusinessHealthDomainId,
  type ExecutiveBusinessHealthIndicator,
  type ExecutiveBusinessHealthProfile,
  type ExecutiveBusinessHealthSeverity,
  type ExecutiveBusinessHealthStatus,
  type ExecutiveBusinessHealthSummary,
  type ExecutiveBusinessHealthTrend,
} from "./executiveBusinessHealthIndex.ts";
import {
  ExecutiveBusinessHealthCapabilityRegistry,
  ExecutiveBusinessHealthDimensionRegistry,
  ExecutiveBusinessHealthDomainRegistry,
  ExecutiveBusinessHealthIndicatorRegistry,
  ExecutiveBusinessHealthRegistryMetadata,
  ExecutiveBusinessHealthScoreRangeRegistry,
  ExecutiveBusinessHealthSeverityRegistry,
  ExecutiveBusinessHealthStatusRegistry,
  ExecutiveBusinessHealthTrendRegistry,
} from "./executiveBusinessHealthRegistryIndex.ts";

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveBusinessHealthContractVersion,
    tags: Object.freeze(["business-health", tag]),
    labels: Object.freeze(["bus-32", "model"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessHealthModelId = "BUS-32:3" as const;

export const ExecutiveBusinessHealthModelVersion = "1.0.0" as const;

export const ExecutiveBusinessHealthModelName =
  "Executive Business Health Intelligence Model" as const;

export const ExecutiveBusinessHealthModelDescription =
  "Canonical metadata-only model layer for executive business health intelligence." as const;

export const ExecutiveBusinessHealthModelMetadata = Object.freeze({
  modelId: ExecutiveBusinessHealthModelId,
  modelVersion: ExecutiveBusinessHealthModelVersion,
  modelName: ExecutiveBusinessHealthModelName,
  modelDescription: ExecutiveBusinessHealthModelDescription,
  modelNamespace: "nexora.bus.executive-business-health.model",
  modelDependencies: Object.freeze([
    "BUS-32:1 Executive Business Health Intelligence Contracts",
    "BUS-32:2 Executive Business Health Registry",
  ]),
  modelConsumers: Object.freeze([
    "BUS-32:4 Validation",
    "BUS-32:5 Manifest",
    "BUS-32:6 Platform",
  ]),
  registryMetadata: ExecutiveBusinessHealthRegistryMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

const buildProfile = (): ExecutiveBusinessHealthProfile =>
  Object.freeze({
    id: "executive-business-health-profile-canonical",
    name: "Executive Business Health Canonical Profile",
    description:
      "Complete metadata-only executive business health profile assembled from registry components.",
    dimensions: ExecutiveBusinessHealthDimensionRegistry,
    metadata: createMetadata("profile"),
    metadataOnly: true,
    immutable: true,
  });

const buildSummary = (): ExecutiveBusinessHealthSummary =>
  Object.freeze({
    profileId: "executive-business-health-profile-canonical",
    description:
      "Executive summary metadata for business health coverage across all canonical domains.",
    domains: Object.freeze(
      ExecutiveBusinessHealthDomainRegistry.map((domain) => domain.id),
    ) as readonly ExecutiveBusinessHealthDomainId[],
    metadata: createMetadata("summary"),
    metadataOnly: true,
    immutable: true,
  });

const buildContract = (): ExecutiveBusinessHealthContract =>
  Object.freeze({
    profile: buildProfile(),
    summary: buildSummary(),
    metadataOnly: true,
    immutable: true,
  });

export const buildExecutiveBusinessHealthModel = () =>
  Object.freeze({
    contractId: ExecutiveBusinessHealthContractId,
    contractVersion: ExecutiveBusinessHealthContractVersion,
    contractName: ExecutiveBusinessHealthContractName,
    contractDescription: ExecutiveBusinessHealthContractDescription,
    profile: buildContract().profile,
    summary: buildContract().summary,
    domains: ExecutiveBusinessHealthDomainRegistry,
    dimensions: ExecutiveBusinessHealthDimensionRegistry,
    capabilities: ExecutiveBusinessHealthCapabilityRegistry,
    indicators: ExecutiveBusinessHealthIndicatorRegistry,
    scoreRanges: ExecutiveBusinessHealthScoreRangeRegistry,
    statuses: ExecutiveBusinessHealthStatusRegistry,
    trends: ExecutiveBusinessHealthTrendRegistry,
    severities: ExecutiveBusinessHealthSeverityRegistry,
    metadata: ExecutiveBusinessHealthModelMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessHealthCanonicalModel = buildExecutiveBusinessHealthModel();

export const getExecutiveBusinessHealthModelSummary = () =>
  ExecutiveBusinessHealthCanonicalModel.summary;

export const getExecutiveBusinessHealthModelDomains = () =>
  ExecutiveBusinessHealthCanonicalModel.domains;

export const getExecutiveBusinessHealthModelDimensions = (): readonly ExecutiveBusinessHealthDimension[] =>
  ExecutiveBusinessHealthCanonicalModel.dimensions;

export const getExecutiveBusinessHealthModelCapabilities = (): readonly ExecutiveBusinessHealthCapability[] =>
  ExecutiveBusinessHealthCanonicalModel.capabilities;

export const getExecutiveBusinessHealthModelIndicators = (): readonly ExecutiveBusinessHealthIndicator[] =>
  ExecutiveBusinessHealthCanonicalModel.indicators;

export const ExecutiveBusinessHealthModelFoundation = Object.freeze({
  metadata: ExecutiveBusinessHealthModelMetadata,
  canonicalModel: ExecutiveBusinessHealthCanonicalModel,
  buildExecutiveBusinessHealthModel,
  getExecutiveBusinessHealthModelSummary,
  getExecutiveBusinessHealthModelDomains,
  getExecutiveBusinessHealthModelDimensions,
  getExecutiveBusinessHealthModelCapabilities,
  getExecutiveBusinessHealthModelIndicators,
  metadataOnly: true,
  immutable: true,
});
