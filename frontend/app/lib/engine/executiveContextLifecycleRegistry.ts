import { ExecutiveContextAssemblyLifecycle } from "./executiveContextAssemblyFoundation.ts";
import type { ExecutiveContextLifecycleRegistryEntry, ExecutiveContextRegistryCollection } from "./executiveContextAssemblyRegistryTypes.ts";

const entries = Object.freeze(ExecutiveContextAssemblyLifecycle.map((stage) => Object.freeze({
  id: stage.id,
  key: stage.name,
  name: stage.name,
  description: stage.description,
  order: stage.order,
  status: "Registered",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveContextLifecycleRegistryEntry)));

export const ExecutiveContextLifecycleRegistry = Object.freeze({
  id: "eng-4-registry-lifecycle-stages",
  group: "LifecycleStages",
  category: "Lifecycle",
  owner: "ENG-4",
  version: "1.0.0",
  namespace: "nexora.engine.executive.context-assembly.registry",
  entries,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryCollection<ExecutiveContextLifecycleRegistryEntry>);
