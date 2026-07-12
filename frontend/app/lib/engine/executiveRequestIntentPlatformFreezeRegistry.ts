import type { ExecutiveRequestIntentFreezeRegistry as FreezeRegistry, ExecutiveRequestIntentFreezeRegistryEntry } from "./executiveRequestIntentPlatformFreezeTypes.ts";

const entry = (identifier: ExecutiveRequestIntentFreezeRegistryEntry["identifier"], phase: ExecutiveRequestIntentFreezeRegistryEntry["phase"], namespace: string, publicDependencyReference: string) => Object.freeze({
  identifier, phase, namespace, version: "1.0.0", owner: "ENG-2",
  freezeStatus: "Frozen", releaseStatus: "ReadyForPublicIndex",
  publicDependencyReference, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentFreezeRegistryEntry);

export const ExecutiveRequestIntentPlatformFreezeRegistry = Object.freeze([
  entry("eng-2-freeze-foundation", "ENG-2:1", "nexora.engine.executive.request-intent.foundation", "executiveRequestIntentIndex.ts"),
  entry("eng-2-freeze-registry", "ENG-2:2", "nexora.engine.executive.request-intent.registry", "executiveRequestIntentRegistryIndex.ts"),
  entry("eng-2-freeze-model", "ENG-2:3", "nexora.engine.executive.request-intent.model", "executiveRequestIntentModelIndex.ts"),
  entry("eng-2-freeze-validation", "ENG-2:4", "nexora.engine.executive.request-intent.validation", "executiveRequestIntentValidationIndex.ts"),
  entry("eng-2-freeze-manifest", "ENG-2:5", "nexora.engine.executive.request-intent.manifest", "executiveRequestIntentManifestIndex.ts"),
  entry("eng-2-freeze-platform", "ENG-2:6", "nexora.engine.executive.request-intent.platform", "executiveRequestIntentPlatformIndex.ts"),
  entry("eng-2-freeze-certification", "ENG-2:7", "nexora.engine.executive.request-intent.certification", "executiveRequestIntentPlatformCertificationIndex.ts"),
] as const) satisfies FreezeRegistry;
