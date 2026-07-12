import { ResourceCapabilityRegistry } from "./resourceMetadataIndex.ts";
import type { ResourceCapacityDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceCapacityModel = Object.freeze([
  Object.freeze({
    id: "resource-capacity-human",
    name: "Human Capacity",
    description: "Capacity metadata for human and team resource descriptors.",
    unitOfMeasure: "Hours / Availability Window",
    planningMetadata: Object.freeze([
      "effort-band",
      "capacity-window",
      "availability-confidence",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-capacity-digital",
    name: "Digital Capacity",
    description: "Capacity metadata for software, API, database, and cloud resources.",
    unitOfMeasure: "Concurrency / Throughput Band",
    planningMetadata: Object.freeze([
      "service-bandwidth",
      "usage-quota",
      "scalability-class",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-capacity-physical",
    name: "Physical Capacity",
    description: "Capacity metadata for equipment, hardware, facility, and inventory resources.",
    unitOfMeasure: "Units / Slots / Access Window",
    planningMetadata: Object.freeze([
      "utilization-band",
      "maintenance-window",
      "shared-access-policy",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceCapacityDescriptor[]);

export const ResourceCapacityModelSummary = Object.freeze({
  capabilityCoverageCount: ResourceCapabilityRegistry.length,
  descriptorCount: ResourceCapacityModel.length,
  metadataOnly: true,
  immutable: true,
} as const);
