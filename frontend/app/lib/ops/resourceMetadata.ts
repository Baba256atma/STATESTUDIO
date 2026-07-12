import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ResourceIntelligenceArchitecturalLevel,
  ResourceIntelligenceIdentity,
  ResourceIntelligencePlatformId,
  ResourceIntelligencePlatformVersion,
} from "./resourceIntelligenceIndex.ts";

export interface ResourceDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface ResourcePlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly resourceIntelligenceScope: string;
  readonly architecturalLevel: string;
  readonly supportedResourceDomains: readonly ResourceDomainDescriptor[];
  readonly releaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly dependencySource: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ResourceSupportedDomains = Object.freeze([
  Object.freeze({
    id: "human-resources",
    name: "Human Resources",
    description: "Metadata domain for human resource descriptors.",
  }),
  Object.freeze({
    id: "team-resources",
    name: "Team Resources",
    description: "Metadata domain for team resource descriptors.",
  }),
  Object.freeze({
    id: "ai-agent-resources",
    name: "AI Agent Resources",
    description: "Metadata domain for AI agent resource descriptors.",
  }),
  Object.freeze({
    id: "software-resources",
    name: "Software Resources",
    description: "Metadata domain for software resource descriptors.",
  }),
  Object.freeze({
    id: "hardware-resources",
    name: "Hardware Resources",
    description: "Metadata domain for hardware resource descriptors.",
  }),
  Object.freeze({
    id: "equipment-resources",
    name: "Equipment Resources",
    description: "Metadata domain for equipment resource descriptors.",
  }),
  Object.freeze({
    id: "financial-resources",
    name: "Financial Resources",
    description: "Metadata domain for financial resource descriptors.",
  }),
  Object.freeze({
    id: "facility-resources",
    name: "Facility Resources",
    description: "Metadata domain for facility resource descriptors.",
  }),
  Object.freeze({
    id: "vendor-resources",
    name: "Vendor Resources",
    description: "Metadata domain for vendor resource descriptors.",
  }),
  Object.freeze({
    id: "cloud-resources",
    name: "Cloud Resources",
    description: "Metadata domain for cloud resource descriptors.",
  }),
  Object.freeze({
    id: "database-resources",
    name: "Database Resources",
    description: "Metadata domain for database resource descriptors.",
  }),
  Object.freeze({
    id: "api-resources",
    name: "API Resources",
    description: "Metadata domain for API resource descriptors.",
  }),
  Object.freeze({
    id: "time-resources",
    name: "Time Resources",
    description: "Metadata domain for time resource descriptors.",
  }),
  Object.freeze({
    id: "material-resources",
    name: "Material Resources",
    description: "Metadata domain for material resource descriptors.",
  }),
  Object.freeze({
    id: "inventory-resources",
    name: "Inventory Resources",
    description: "Metadata domain for inventory resource descriptors.",
  }),
  Object.freeze({
    id: "future-resource-extensions",
    name: "Future Resource Extensions",
    description: "Metadata domain for future resource intelligence extensions.",
  }),
] as const);

export const ResourcePlatformMetadata = Object.freeze({
  platformId: ResourceIntelligencePlatformId,
  platformName: ResourceIntelligenceIdentity.platformName,
  platformNamespace: ResourceIntelligenceIdentity.platformNamespace,
  platformVersion: ResourceIntelligencePlatformVersion,
  resourceIntelligenceScope: "Executive resource intelligence architecture",
  architecturalLevel: ResourceIntelligenceArchitecturalLevel,
  supportedResourceDomains: ResourceSupportedDomains,
  releaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  dependencySource: ExecutiveOperationsPublicIndexId,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ResourcePlatformMetadataDescriptor);

