import type { ExecutiveContextOwnershipRegistryEntry, ExecutiveContextRegistryCollection } from "./executiveContextAssemblyRegistryTypes.ts";

const ownership = (
  id: string,
  group: ExecutiveContextOwnershipRegistryEntry["group"],
  category: ExecutiveContextOwnershipRegistryEntry["category"],
  ownedArtifact: string,
  description: string,
) => Object.freeze({
  id, group, category, ownedArtifact, description,
  owner: "ENG-4", status: "Registered", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextOwnershipRegistryEntry);

export const ExecutiveContextOwnershipRegistry = Object.freeze({
  id: "eng-4-registry-ownership",
  group: "Ownership",
  category: "Ownership",
  owner: "ENG-4",
  version: "1.0.0",
  namespace: "nexora.engine.executive.context-assembly.registry",
  entries: Object.freeze([
    ownership(
      "eng-4-ownership-domains",
      "ContextDomains",
      "Domain",
      "ExecutiveContextDomainRegistry",
      "ENG-4 owns architectural domain registry metadata for Executive Context Assembly.",
    ),
    ownership(
      "eng-4-ownership-sources",
      "ContextSources",
      "Source",
      "ExecutiveContextSourceRegistry",
      "ENG-4 owns architectural source registry metadata for Executive Context Assembly.",
    ),
    ownership(
      "eng-4-ownership-capabilities",
      "ContextCapabilities",
      "Capability",
      "ExecutiveContextCapabilityRegistry",
      "ENG-4 owns architectural capability registry metadata for Executive Context Assembly.",
    ),
    ownership(
      "eng-4-ownership-lifecycle",
      "LifecycleStages",
      "Lifecycle",
      "ExecutiveContextLifecycleRegistry",
      "ENG-4 owns architectural lifecycle registry metadata for Executive Context Assembly.",
    ),
    ownership(
      "eng-4-ownership-contracts",
      "ArchitecturalContracts",
      "Contract",
      "ExecutiveContextAssemblyContracts",
      "ENG-4 owns architectural contract metadata published by the Context Assembly Foundation.",
    ),
    ownership(
      "eng-4-ownership-public-apis",
      "PublicApis",
      "PublicApi",
      "ExecutiveContextAssemblyRegistryPublicApis",
      "ENG-4 owns the approved public registry helper APIs for Executive Context Assembly.",
    ),
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryCollection<ExecutiveContextOwnershipRegistryEntry>);
