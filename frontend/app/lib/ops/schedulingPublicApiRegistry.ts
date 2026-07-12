import {
  ExecutiveSchedulingIntelligenceFoundation,
  SchedulingIntelligencePlatformDescription,
  SchedulingIntelligencePlatformId,
  SchedulingIntelligencePlatformName,
  SchedulingIntelligencePlatformNamespace,
  SchedulingIntelligencePlatformVersion,
  SchedulingIntelligencePublicApis,
} from "./schedulingIntelligenceIndex.ts";
import { SchedulingPlatformMetadata } from "./schedulingMetadata.ts";

export interface SchedulingPublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const SchedulingPublicApiRegistry = Object.freeze([
  ...SchedulingIntelligencePublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "SchedulingIntelligencePlatformId",
    kind: "Constant",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "SchedulingIntelligencePlatformVersion",
    kind: "Constant",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "SchedulingIntelligencePlatformName",
    kind: "Constant",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "SchedulingIntelligencePlatformNamespace",
    kind: "Constant",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "SchedulingIntelligencePlatformDescription",
    kind: "Constant",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutiveSchedulingIntelligenceFoundation",
    kind: "Object",
    exportSource: "./schedulingIntelligenceIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly SchedulingPublicApiRegistryEntry[]);

export const SchedulingPublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.scheduling-intelligence.public-api-registry",
  registryVersion: SchedulingPlatformMetadata.compatibilityVersion,
  exportedApiCount: SchedulingPublicApiRegistry.length,
  rootPlatformId: SchedulingIntelligencePlatformId,
  rootPlatformVersion: SchedulingIntelligencePlatformVersion,
  rootPlatformName: SchedulingIntelligencePlatformName,
  rootPlatformNamespace: SchedulingIntelligencePlatformNamespace,
  rootPlatformDescription: SchedulingIntelligencePlatformDescription,
  rootPlatformFoundation: ExecutiveSchedulingIntelligenceFoundation,
  metadataOnly: true,
  immutable: true,
} as const);
