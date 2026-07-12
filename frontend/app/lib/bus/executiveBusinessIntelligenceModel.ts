import {
  ExecutiveBusinessIntelligenceContractDescription,
  ExecutiveBusinessIntelligenceContractId,
  ExecutiveBusinessIntelligenceContractName,
  ExecutiveBusinessIntelligenceContractVersion,
  type ExecutiveBusinessIntelligenceCapability,
  type ExecutiveBusinessIntelligenceContract,
  type ExecutiveBusinessIntelligenceDependency,
  type ExecutiveBusinessIntelligenceDomain,
  type ExecutiveBusinessIntelligenceNamespace,
  type ExecutiveBusinessIntelligencePlatformReference,
  type ExecutiveBusinessIntelligenceProfile,
  type ExecutiveBusinessIntelligenceSummary,
} from "./executiveBusinessIntelligenceIndex.ts";
import {
  ExecutiveBusinessIntelligenceCapabilityRegistry,
  ExecutiveBusinessIntelligenceDependencyRegistry,
  ExecutiveBusinessIntelligenceDomainRegistry,
  ExecutiveBusinessIntelligenceIntegrationRegistry,
  ExecutiveBusinessIntelligenceNamespaceRegistry,
  ExecutiveBusinessIntelligencePlatformRegistry,
  ExecutiveBusinessIntelligenceRegistryMetadata,
  getExecutiveBusinessIntelligenceCapabilitiesByDomain,
  getExecutiveBusinessIntelligencePlatformsByDomain,
} from "./executiveBusinessIntelligenceRegistryIndex.ts";

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveBusinessIntelligenceContractVersion,
    tags: Object.freeze(["executive-business-intelligence", tag]),
    labels: Object.freeze(["bus-34", "model"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessIntelligenceModelId = "BUS-34:3" as const;

export const ExecutiveBusinessIntelligenceModelVersion = "1.0.0" as const;

export const ExecutiveBusinessIntelligenceModelName =
  "Executive Business Intelligence Model" as const;

export const ExecutiveBusinessIntelligenceModelDescription =
  "Canonical metadata-only model layer for executive business intelligence." as const;

export const ExecutiveBusinessIntelligenceModelMetadata = Object.freeze({
  modelId: ExecutiveBusinessIntelligenceModelId,
  modelVersion: ExecutiveBusinessIntelligenceModelVersion,
  modelName: ExecutiveBusinessIntelligenceModelName,
  modelDescription: ExecutiveBusinessIntelligenceModelDescription,
  modelNamespace: "nexora.bus.executive-business-intelligence.model",
  modelDependencies: Object.freeze([
    "BUS-34:1 Executive Business Intelligence Contracts",
    "BUS-34:2 Executive Business Intelligence Registry",
  ]),
  modelConsumers: Object.freeze([
    "BUS-34:4 Validation",
    "BUS-34:5 Manifest",
    "BUS-34:6 Platform",
  ]),
  registryMetadata: ExecutiveBusinessIntelligenceRegistryMetadata,
  metadataOnly: true,
  immutable: true,
} as const);

const buildProfile = (): ExecutiveBusinessIntelligenceProfile =>
  Object.freeze({
    id: "executive-business-intelligence-profile-canonical",
    name: "Executive Business Intelligence Canonical Profile",
    description:
      "Complete metadata-only executive business intelligence profile assembled from registry components.",
    capabilities: ExecutiveBusinessIntelligenceCapabilityRegistry,
    platforms: ExecutiveBusinessIntelligencePlatformRegistry,
    namespaces: ExecutiveBusinessIntelligenceNamespaceRegistry,
    metadata: createMetadata("profile"),
    metadataOnly: true,
    immutable: true,
  });

const buildSummary = (): ExecutiveBusinessIntelligenceSummary =>
  Object.freeze({
    profileId: "executive-business-intelligence-profile-canonical",
    description:
      "Executive business intelligence summary metadata spanning all supported domains and certified BUS platforms.",
    supportedDomains: ExecutiveBusinessIntelligenceDomainRegistry,
    supportedPlatforms: Object.freeze(
      ExecutiveBusinessIntelligencePlatformRegistry.map((platform) => platform.id),
    ) as readonly ExecutiveBusinessIntelligencePlatformReference["id"][],
    metadata: createMetadata("summary"),
    metadataOnly: true,
    immutable: true,
  });

const buildContract = (): ExecutiveBusinessIntelligenceContract =>
  Object.freeze({
    profile: buildProfile(),
    summary: buildSummary(),
    metadataOnly: true,
    immutable: true,
  });

const domainCapabilityRelationships = Object.freeze(
  ExecutiveBusinessIntelligenceDomainRegistry.map((domain) =>
    Object.freeze({
      domain,
      capabilityIds: Object.freeze(
        getExecutiveBusinessIntelligenceCapabilitiesByDomain(domain).map(
          (capability) => capability.id,
        ),
      ),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

const domainPlatformRelationships = Object.freeze(
  ExecutiveBusinessIntelligenceDomainRegistry.map((domain) =>
    Object.freeze({
      domain,
      platformIds: Object.freeze(
        getExecutiveBusinessIntelligencePlatformsByDomain(domain).map(
          (platform) => platform.id,
        ),
      ),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

const platformDependencyRelationships = Object.freeze(
  ExecutiveBusinessIntelligenceDependencyRegistry.map((dependency) =>
    Object.freeze({
      dependencyId: dependency.id,
      sourcePlatformId: dependency.source,
      targetPlatformId: dependency.target,
      relationship: dependency.relationship,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const buildExecutiveBusinessIntelligenceModel = () =>
  Object.freeze({
    contractId: ExecutiveBusinessIntelligenceContractId,
    contractVersion: ExecutiveBusinessIntelligenceContractVersion,
    contractName: ExecutiveBusinessIntelligenceContractName,
    contractDescription: ExecutiveBusinessIntelligenceContractDescription,
    profile: buildContract().profile,
    summary: buildContract().summary,
    domains: ExecutiveBusinessIntelligenceDomainRegistry,
    capabilities: ExecutiveBusinessIntelligenceCapabilityRegistry,
    platforms: ExecutiveBusinessIntelligencePlatformRegistry,
    namespaces: ExecutiveBusinessIntelligenceNamespaceRegistry,
    dependencies: ExecutiveBusinessIntelligenceDependencyRegistry,
    integrations: ExecutiveBusinessIntelligenceIntegrationRegistry,
    relationships: Object.freeze({
      domainToCapability: domainCapabilityRelationships,
      domainToPlatform: domainPlatformRelationships,
      platformToPlatformDependency: platformDependencyRelationships,
      metadataOnly: true,
      immutable: true,
    }),
    metadata: ExecutiveBusinessIntelligenceModelMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveBusinessIntelligenceCanonicalModel =
  buildExecutiveBusinessIntelligenceModel();

export const getExecutiveBusinessIntelligenceModelSummary = () =>
  Object.freeze({
    profileId: ExecutiveBusinessIntelligenceCanonicalModel.profile.id,
    domainCount: ExecutiveBusinessIntelligenceCanonicalModel.domains.length,
    capabilityCount: ExecutiveBusinessIntelligenceCanonicalModel.capabilities.length,
    platformCount: ExecutiveBusinessIntelligenceCanonicalModel.platforms.length,
    relationshipCount:
      ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToCapability.length +
      ExecutiveBusinessIntelligenceCanonicalModel.relationships.domainToPlatform.length +
      ExecutiveBusinessIntelligenceCanonicalModel.relationships.platformToPlatformDependency.length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const getExecutiveBusinessIntelligenceModelDomains = () =>
  ExecutiveBusinessIntelligenceCanonicalModel.domains;

export const getExecutiveBusinessIntelligenceModelCapabilities =
  (): readonly ExecutiveBusinessIntelligenceCapability[] =>
    ExecutiveBusinessIntelligenceCanonicalModel.capabilities;

export const getExecutiveBusinessIntelligenceModelPlatforms =
  (): readonly ExecutiveBusinessIntelligencePlatformReference[] =>
    ExecutiveBusinessIntelligenceCanonicalModel.platforms;

export const getExecutiveBusinessIntelligenceModelNamespaces =
  (): readonly ExecutiveBusinessIntelligenceNamespace[] =>
    ExecutiveBusinessIntelligenceCanonicalModel.namespaces;

export const getExecutiveBusinessIntelligenceModelDependencies =
  (): readonly ExecutiveBusinessIntelligenceDependency[] =>
    ExecutiveBusinessIntelligenceCanonicalModel.dependencies;

export const ExecutiveBusinessIntelligenceModelFoundation = Object.freeze({
  metadata: ExecutiveBusinessIntelligenceModelMetadata,
  canonicalModel: ExecutiveBusinessIntelligenceCanonicalModel,
  buildExecutiveBusinessIntelligenceModel,
  getExecutiveBusinessIntelligenceModelSummary,
  getExecutiveBusinessIntelligenceModelDomains,
  getExecutiveBusinessIntelligenceModelCapabilities,
  getExecutiveBusinessIntelligenceModelPlatforms,
  getExecutiveBusinessIntelligenceModelNamespaces,
  getExecutiveBusinessIntelligenceModelDependencies,
  metadataOnly: true,
  immutable: true,
});
