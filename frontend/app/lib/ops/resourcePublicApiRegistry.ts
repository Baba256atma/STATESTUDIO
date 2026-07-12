import {
  ExecutiveResourceIntelligenceFoundation,
  ResourceIntelligencePlatformDescription,
  ResourceIntelligencePlatformId,
  ResourceIntelligencePlatformName,
  ResourceIntelligencePlatformNamespace,
  ResourceIntelligencePlatformVersion,
  ResourceIntelligencePublicApis,
} from "./resourceIntelligenceIndex.ts";
import { ResourcePlatformMetadata } from "./resourceMetadata.ts";

export interface ResourcePublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const ResourcePublicApiRegistry = Object.freeze([
  ...ResourceIntelligencePublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "ResourceIntelligencePlatformId",
    kind: "Constant",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ResourceIntelligencePlatformVersion",
    kind: "Constant",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ResourceIntelligencePlatformName",
    kind: "Constant",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ResourceIntelligencePlatformNamespace",
    kind: "Constant",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ResourceIntelligencePlatformDescription",
    kind: "Constant",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutiveResourceIntelligenceFoundation",
    kind: "Object",
    exportSource: "./resourceIntelligenceIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly ResourcePublicApiRegistryEntry[]);

export const ResourcePublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.resource-intelligence.public-api-registry",
  registryVersion: ResourcePlatformMetadata.compatibilityVersion,
  exportedApiCount: ResourcePublicApiRegistry.length,
  rootPlatformId: ResourceIntelligencePlatformId,
  rootPlatformVersion: ResourceIntelligencePlatformVersion,
  rootPlatformName: ResourceIntelligencePlatformName,
  rootPlatformNamespace: ResourceIntelligencePlatformNamespace,
  rootPlatformDescription: ResourceIntelligencePlatformDescription,
  rootPlatformFoundation: ExecutiveResourceIntelligenceFoundation,
  metadataOnly: true,
  immutable: true,
} as const);

