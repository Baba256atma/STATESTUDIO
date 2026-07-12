import { ExecutiveOperationsSuiteCompatibilityMatrix, ExecutiveOperationsSuiteCompatibilityRegistry, ExecutiveOperationsSuiteRegressionInventory, getExecutiveOperationsSuiteCompatibility } from "./executiveOperationsSuiteCompatibilityIndex.ts";
import { ExecutiveOperationsSuiteFreezeManifest } from "./executiveOperationsSuiteFreezeManifest.ts";
import { ExecutiveOperationsSuiteFreezeMetadata, ExecutiveOperationsSuiteFreezeRegistry } from "./executiveOperationsSuiteFreezeRegistry.ts";
import type { ExecutiveOperationsSuiteFreeze as FreezeShape, ExecutiveOperationsSuiteFreezeSummary } from "./executiveOperationsSuiteFreezeTypes.ts";

const summary = Object.freeze({
  freezeStatus: "Locked", releaseStatus: "Frozen",
  lockCount: ExecutiveOperationsSuiteFreezeRegistry.length,
  compatibilitySnapshotCount: ExecutiveOperationsSuiteCompatibilityRegistry.length,
  regressionSnapshotCount: ExecutiveOperationsSuiteRegressionInventory.length,
  dependencySnapshotCount: ExecutiveOperationsSuiteCompatibilityMatrix.length,
  readiness: "ReadyForPublicIndex", nextPhase: "OPS-10:9",
  suiteVersion: getExecutiveOperationsSuiteCompatibility().summary.suiteVersion,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteFreezeSummary);

export const ExecutiveOperationsSuiteFreeze = Object.freeze({
  metadata: ExecutiveOperationsSuiteFreezeMetadata,
  registry: ExecutiveOperationsSuiteFreezeRegistry,
  manifest: ExecutiveOperationsSuiteFreezeManifest,
  summary,
} as const satisfies FreezeShape);

export const getExecutiveOperationsSuiteFreeze = () => ExecutiveOperationsSuiteFreeze;
export const getExecutiveOperationsSuiteFreezeRegistry = () => ExecutiveOperationsSuiteFreezeRegistry;
export const getExecutiveOperationsSuiteFreezeManifest = () => ExecutiveOperationsSuiteFreezeManifest;
export const getExecutiveOperationsSuiteFreezeSummary = () => summary;
export const getExecutiveOperationsSuiteFreezeMetadata = () => ExecutiveOperationsSuiteFreezeMetadata;
export const getExecutiveOperationsSuiteFreezeEntryById = (id: string) => ExecutiveOperationsSuiteFreezeRegistry.find((entry) => entry.id === id);
