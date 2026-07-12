import { ResourceDependencyRegistry } from "./resourceMetadataIndex.ts";
import type { ResourceDependencyDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceDependencyModel = Object.freeze([
  Object.freeze({
    id: "resource-dependency-prerequisite",
    name: "Prerequisite Dependency",
    description: "Dependency metadata describing prerequisites for resource utilization.",
    dependencyTypes: Object.freeze(["Approval", "Access", "Availability", "Provisioning"]),
    downstreamImpactMetadata: Object.freeze([
      "delivery-risk",
      "capacity-impact",
      "workflow-blocker",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-dependency-shared",
    name: "Shared Dependency",
    description: "Dependency metadata describing shared or contested resource usage.",
    dependencyTypes: Object.freeze(["Shared Access", "Quota", "Reservation"]),
    downstreamImpactMetadata: Object.freeze([
      "contention-band",
      "handoff-risk",
      "substitution-policy",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceDependencyDescriptor[]);

export const ResourceDependencyModelSummary = Object.freeze({
  registryDependencyCount: ResourceDependencyRegistry.length,
  modelDependencyCount: ResourceDependencyModel.length,
  metadataOnly: true,
  immutable: true,
} as const);
