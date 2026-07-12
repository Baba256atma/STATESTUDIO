import type { ExecutiveEngineComponentRegistryEntry, ExecutiveEngineLifecycleStatus } from "./engineRegistryTypes.ts";

const component = (id: string, name: string, lifecycleStatus: ExecutiveEngineLifecycleStatus, description: string) => Object.freeze({
  id, name, description, ownership: "ExecutiveEngine", lifecycleStatus,
  publicVisibility: true, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineComponentRegistryEntry);

export const ExecutiveEngineComponentRegistry = Object.freeze([
  component("foundation", "Foundation", "active", "ENG-1:1 public architectural foundation."),
  component("registry", "Registry", "active", "ENG-1:2 public architectural registry."),
  component("model", "Model", "planned", "Reserved public model component."),
  component("validation", "Validation", "planned", "Reserved public validation component."),
  component("manifest", "Manifest", "planned", "Reserved public manifest component."),
  component("platform", "Platform", "planned", "Reserved public platform component."),
  component("certification", "Certification", "planned", "Reserved public certification component."),
  component("freeze", "Freeze", "planned", "Reserved public freeze component."),
  component("public-index", "Public Index", "planned", "Reserved final public index component."),
] as const);
