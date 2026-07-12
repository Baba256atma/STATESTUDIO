import { ResourceCapabilityRegistry } from "./resourceMetadataIndex.ts";
import type { ResourceCapabilityDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceCapabilityModel = Object.freeze([
  Object.freeze({
    id: "resource-capability-human",
    name: "Human Capability Metadata",
    description: "Capability and skill descriptors for people and team resources.",
    skillCategories: Object.freeze(["Leadership", "Execution", "Domain", "Approval"]),
    capabilityDescriptors: Object.freeze([
      "role-alignment",
      "skill-band",
      "coverage-availability",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-capability-digital",
    name: "Digital Capability Metadata",
    description: "Capability descriptors for software, services, APIs, and databases.",
    skillCategories: Object.freeze(["Integration", "Platform", "Automation", "Security"]),
    capabilityDescriptors: Object.freeze([
      "service-scope",
      "integration-surface",
      "support-boundary",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-capability-physical",
    name: "Physical Capability Metadata",
    description: "Capability descriptors for facilities, equipment, and inventory resources.",
    skillCategories: Object.freeze(["Access", "Operation", "Maintenance", "Safety"]),
    capabilityDescriptors: Object.freeze([
      "operational-scope",
      "access-control",
      "maintenance-class",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceCapabilityDescriptor[]);

export const ResourceCapabilityModelSummary = Object.freeze({
  registryCapabilityCount: ResourceCapabilityRegistry.length,
  modelCapabilityCount: ResourceCapabilityModel.length,
  metadataOnly: true,
  immutable: true,
} as const);
