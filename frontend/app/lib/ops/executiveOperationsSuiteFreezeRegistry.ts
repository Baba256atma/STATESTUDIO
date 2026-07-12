import { ExecutiveOperationsSuiteCompatibilityVersion, getExecutiveOperationsSuiteCompatibilityMetadata } from "./executiveOperationsSuiteCompatibilityIndex.ts";
import type { ExecutiveOperationsSuiteFreezeRegistryEntry, ExecutiveOperationsSuiteFreezeStatusDescriptor } from "./executiveOperationsSuiteFreezeTypes.ts";

export const ExecutiveOperationsSuiteFreezeId = "executive-operations-suite-freeze" as const;
export const ExecutiveOperationsSuiteFreezeName = "Executive Operations Suite Freeze" as const;
export const ExecutiveOperationsSuiteFreezeDescription = "Immutable architectural release-lock metadata for the Executive Operations Suite." as const;
export const ExecutiveOperationsSuiteFreezeVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteFreezeNamespace = "nexora.ops.suite.freeze" as const;
export const ExecutiveOperationsSuiteFreezeStatus = Object.freeze({
  metadataOnly: true, phase: "Freeze", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Frozen",
} as const satisfies ExecutiveOperationsSuiteFreezeStatusDescriptor);

const lock = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, status: "Locked", locked: true, immutable: true, metadataOnly: true,
} as const satisfies ExecutiveOperationsSuiteFreezeRegistryEntry);
export const ExecutiveOperationsSuiteFreezeRegistry = Object.freeze([
  lock("suite-freeze-foundation", "Foundation Lock", "Describes the frozen suite foundation surface."),
  lock("suite-freeze-registry", "Registry Lock", "Describes the frozen suite registry surface."),
  lock("suite-freeze-validation", "Validation Lock", "Describes the frozen validation metadata surface."),
  lock("suite-freeze-manifest", "Manifest Lock", "Describes the frozen manifest surface."),
  lock("suite-freeze-platform", "Platform Lock", "Describes the frozen platform namespace."),
  lock("suite-freeze-certification", "Certification Lock", "Describes the frozen certification metadata."),
  lock("suite-freeze-compatibility", "Compatibility Lock", "Describes the frozen compatibility metadata."),
  lock("suite-freeze-regression", "Regression Lock", "Describes the frozen regression coverage inventory."),
  lock("suite-freeze-public-api", "Public API Lock", "Describes the stable public API release surface."),
  lock("suite-freeze-namespace", "Namespace Lock", "Describes the canonical namespace lock."),
  lock("suite-freeze-version", "Version Lock", "Describes the canonical version lock."),
  lock("suite-freeze-release", "Release Lock", "Describes the architectural public release lock."),
] as const);

export const ExecutiveOperationsSuiteFreezeMetadata = Object.freeze({
  id: ExecutiveOperationsSuiteFreezeId, name: ExecutiveOperationsSuiteFreezeName,
  description: ExecutiveOperationsSuiteFreezeDescription, version: ExecutiveOperationsSuiteFreezeVersion,
  namespace: ExecutiveOperationsSuiteFreezeNamespace, status: ExecutiveOperationsSuiteFreezeStatus,
  sourceCompatibilityId: getExecutiveOperationsSuiteCompatibilityMetadata().id,
  sourceCompatibilityVersion: ExecutiveOperationsSuiteCompatibilityVersion,
  lockCount: ExecutiveOperationsSuiteFreezeRegistry.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
