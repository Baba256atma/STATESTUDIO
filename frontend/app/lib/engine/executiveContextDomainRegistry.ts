import { ExecutiveContextAssemblyDomains } from "./executiveContextAssemblyFoundation.ts";
import type { ExecutiveContextRegistryCollection, ExecutiveContextRegistryEntry } from "./executiveContextAssemblyRegistryTypes.ts";

const entries = Object.freeze(ExecutiveContextAssemblyDomains.map((domain) => Object.freeze({
  id: domain.id,
  key: domain.name.replaceAll(" ", ""),
  name: domain.name,
  description: domain.description,
  status: "Registered",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveContextRegistryEntry)));

export const ExecutiveContextDomainRegistry = Object.freeze({
  id: "eng-4-registry-context-domains",
  group: "ContextDomains",
  category: "Domain",
  owner: "ENG-4",
  version: "1.0.0",
  namespace: "nexora.engine.executive.context-assembly.registry",
  entries,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryCollection);
