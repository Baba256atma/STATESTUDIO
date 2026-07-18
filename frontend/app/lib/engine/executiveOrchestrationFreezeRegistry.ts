import type {
  ExecutiveOrchestrationFreezeDomainId,
  ExecutiveOrchestrationFreezeRegistryEntry,
} from "./executiveOrchestrationFreezeTypes.ts";

const entry = (
  id: ExecutiveOrchestrationFreezeDomainId,
  name: string,
  description: string,
) => Object.freeze({
  id,
  name,
  description,
  status: "Frozen",
  frozen: true,
  immutable: true,
  metadataOnly: true,
  runtimeFree: true,
  certified: true,
} as const satisfies ExecutiveOrchestrationFreezeRegistryEntry);

/**
 * Canonical ENG-8:8 freeze registry.
 * Declares frozen architectural domains only — no freeze execution.
 */
export const ExecutiveOrchestrationFreezeRegistry = Object.freeze([
  entry(
    "Foundation",
    "Foundation",
    "Frozen ENG-8:1 foundation architectural domain.",
  ),
  entry(
    "Registry",
    "Registry",
    "Frozen ENG-8:2 registry architectural domain.",
  ),
  entry(
    "Model",
    "Model",
    "Frozen ENG-8:3 model architectural domain.",
  ),
  entry(
    "Validation",
    "Validation",
    "Frozen ENG-8:4 validation architectural domain.",
  ),
  entry(
    "Manifest",
    "Manifest",
    "Frozen ENG-8:5 manifest architectural domain.",
  ),
  entry(
    "Platform",
    "Platform",
    "Frozen ENG-8:6 platform architectural domain.",
  ),
  entry(
    "Certification",
    "Certification",
    "Frozen ENG-8:7 certification architectural domain.",
  ),
  entry(
    "PublicAPI",
    "Public API",
    "Frozen public API surface for Executive Orchestration.",
  ),
] as const);
