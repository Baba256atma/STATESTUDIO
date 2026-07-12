import type { ExecutiveRequestIntentPhase } from "./executiveRequestIntentManifestTypes.ts";

const phase = (phaseId: ExecutiveRequestIntentPhase["phaseId"], name: string, namespace: string, status: ExecutiveRequestIntentPhase["status"], publicIndexReference: string) => Object.freeze({
  phaseId, name, namespace, version: "1.0.0", status,
  ownership: "ENG-2", publicIndexReference, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentPhase);

export const ExecutiveRequestIntentPhaseRegistry = Object.freeze([
  phase("ENG-2:1", "Foundation", "nexora.engine.executive.request-intent.foundation", "Complete", "executiveRequestIntentIndex.ts"),
  phase("ENG-2:2", "Registry", "nexora.engine.executive.request-intent.registry", "Complete", "executiveRequestIntentRegistryIndex.ts"),
  phase("ENG-2:3", "Model", "nexora.engine.executive.request-intent.model", "Complete", "executiveRequestIntentModelIndex.ts"),
  phase("ENG-2:4", "Validation", "nexora.engine.executive.request-intent.validation", "Complete", "executiveRequestIntentValidationIndex.ts"),
  phase("ENG-2:5", "Manifest", "nexora.engine.executive.request-intent.manifest", "Active", "executiveRequestIntentManifestIndex.ts"),
] as const);
