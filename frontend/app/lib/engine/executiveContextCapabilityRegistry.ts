import { ExecutiveContextAssemblyCapabilities } from "./executiveContextAssemblyFoundation.ts";
import type { ExecutiveContextRegistryCollection, ExecutiveContextRegistryEntry } from "./executiveContextAssemblyRegistryTypes.ts";

const capabilityNames = Object.freeze([
  Object.freeze({ key: "Identification", name: "Identification" }),
  Object.freeze({ key: "Aggregation", name: "Aggregation" }),
  Object.freeze({ key: "Classification", name: "Classification" }),
  Object.freeze({ key: "Composition", name: "Composition" }),
  Object.freeze({ key: "Normalization", name: "Normalization" }),
  Object.freeze({ key: "Metadata", name: "Metadata" }),
  Object.freeze({ key: "Validation", name: "Validation" }),
  Object.freeze({ key: "Snapshot", name: "Snapshot" }),
  Object.freeze({ key: "VersionMetadata", name: "Version Metadata" }),
  Object.freeze({ key: "Publication", name: "Publication" }),
] as const);

const entries = Object.freeze(ExecutiveContextAssemblyCapabilities.map((capability, index) => {
  const naming = capabilityNames[index]!;
  return Object.freeze({
    id: capability.id,
    key: naming.key,
    name: naming.name,
    description: capability.description,
    status: "Registered",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveContextRegistryEntry);
}));

export const ExecutiveContextCapabilityRegistry = Object.freeze({
  id: "eng-4-registry-context-capabilities",
  group: "ContextCapabilities",
  category: "Capability",
  owner: "ENG-4",
  version: "1.0.0",
  namespace: "nexora.engine.executive.context-assembly.registry",
  entries,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryCollection);
