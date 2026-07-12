import type { ExecutiveRequestIntentPlatformRegistry as PlatformRegistry, ExecutiveRequestIntentPlatformRegistryEntry } from "./executiveRequestIntentPlatformTypes.ts";

const component = (identifier: ExecutiveRequestIntentPlatformRegistryEntry["identifier"], name: ExecutiveRequestIntentPlatformRegistryEntry["component"], phase: ExecutiveRequestIntentPlatformRegistryEntry["phase"], namespace: string, publicIndexReference: string) => Object.freeze({
  identifier, component: name, phase, namespace, owner: "ENG-2", version: "1.0.0",
  status: "Complete", publicIndexReference, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentPlatformRegistryEntry);

export const ExecutiveRequestIntentPlatformRegistry = Object.freeze([
  component("eng-2-platform-component-foundation", "foundation", "ENG-2:1", "nexora.engine.executive.request-intent.foundation", "executiveRequestIntentIndex.ts"),
  component("eng-2-platform-component-registry", "registry", "ENG-2:2", "nexora.engine.executive.request-intent.registry", "executiveRequestIntentRegistryIndex.ts"),
  component("eng-2-platform-component-model", "model", "ENG-2:3", "nexora.engine.executive.request-intent.model", "executiveRequestIntentModelIndex.ts"),
  component("eng-2-platform-component-validation", "validation", "ENG-2:4", "nexora.engine.executive.request-intent.validation", "executiveRequestIntentValidationIndex.ts"),
  component("eng-2-platform-component-manifest", "manifest", "ENG-2:5", "nexora.engine.executive.request-intent.manifest", "executiveRequestIntentManifestIndex.ts"),
] as const) satisfies PlatformRegistry;
