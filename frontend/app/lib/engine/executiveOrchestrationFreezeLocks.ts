import type {
  ExecutiveOrchestrationFreezeLock,
  ExecutiveOrchestrationFreezeLockId,
} from "./executiveOrchestrationFreezeTypes.ts";

const lock = (
  id: ExecutiveOrchestrationFreezeLockId,
  name: string,
  description: string,
  status: "Locked" | "Controlled" = "Locked",
) => Object.freeze({
  id,
  name,
  description,
  locked: true,
  immutable: true,
  status,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationFreezeLock);

/**
 * Immutable architectural locks for ENG-8:8.
 * Declarative only — no executable freeze behavior.
 */
export const ExecutiveOrchestrationFreezeLocks = Object.freeze([
  lock(
    "ArchitectureLocked",
    "Architecture Locked",
    "Locks the certified Executive Orchestration architecture against mutation.",
  ),
  lock(
    "OwnershipLocked",
    "Ownership Locked",
    "Locks ownership boundaries across foundation through certification.",
  ),
  lock(
    "DependencyLocked",
    "Dependency Locked",
    "Locks dependency surfaces to public-API-only certified declarations.",
  ),
  lock(
    "RegistryLocked",
    "Registry Locked",
    "Locks the orchestration registry inventory against replacement.",
  ),
  lock(
    "ModelLocked",
    "Model Locked",
    "Locks the orchestration model surface against semantic replacement.",
  ),
  lock(
    "ValidationLocked",
    "Validation Locked",
    "Locks certified validation declarations against redefinition.",
  ),
  lock(
    "ManifestLocked",
    "Manifest Locked",
    "Locks the orchestration manifest aggregation against mutation.",
  ),
  lock(
    "PlatformLocked",
    "Platform Locked",
    "Locks the ENG-8:6 platform aggregation against reassembly mutation.",
  ),
  lock(
    "PublicApiLocked",
    "Public API Locked",
    "Locks the certified public API surface for release stability.",
  ),
  lock(
    "ExtensionControlled",
    "Extension Controlled",
    "Controls future additive extensions under successor-phase ownership only.",
    "Controlled",
  ),
] as const);
