import { getExecutiveOperationsSuiteCertificationSummary } from "./executiveOperationsSuiteCertificationIndex.ts";
import { ExecutiveOperationsSuiteCompatibilityManifest, ExecutiveOperationsSuiteRegressionSummary } from "./executiveOperationsSuiteCompatibilityManifest.ts";
import { ExecutiveOperationsSuiteCompatibilityMatrix, ExecutiveOperationsSuiteCompatibilityMetadata, ExecutiveOperationsSuiteCompatibilityRegistry, ExecutiveOperationsSuiteRegressionInventory } from "./executiveOperationsSuiteCompatibilityRegistry.ts";
import type { ExecutiveOperationsSuiteCompatibility as CompatibilityShape } from "./executiveOperationsSuiteCompatibilityTypes.ts";

const summary = Object.freeze({
  compatibilityStatus: "Compatible", regressionStatus: "Covered",
  compatibilityEntryCount: ExecutiveOperationsSuiteCompatibilityRegistry.length,
  regressionEntryCount: ExecutiveOperationsSuiteRegressionInventory.length,
  matrixEntryCount: ExecutiveOperationsSuiteCompatibilityMatrix.length,
  releaseReadiness: "ReadyForFreeze", nextPhase: "OPS-10:8",
  suiteVersion: getExecutiveOperationsSuiteCertificationSummary().suiteVersion,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveOperationsSuiteCompatibility = Object.freeze({
  metadata: ExecutiveOperationsSuiteCompatibilityMetadata,
  registry: ExecutiveOperationsSuiteCompatibilityRegistry,
  matrix: ExecutiveOperationsSuiteCompatibilityMatrix,
  manifest: ExecutiveOperationsSuiteCompatibilityManifest,
  summary,
} as const satisfies CompatibilityShape);

export const getExecutiveOperationsSuiteCompatibility = () => ExecutiveOperationsSuiteCompatibility;
export const getExecutiveOperationsSuiteCompatibilityRegistry = () => ExecutiveOperationsSuiteCompatibilityRegistry;
export const getExecutiveOperationsSuiteCompatibilityMatrix = () => ExecutiveOperationsSuiteCompatibilityMatrix;
export const getExecutiveOperationsSuiteRegressionSummary = () => ExecutiveOperationsSuiteRegressionSummary;
export const getExecutiveOperationsSuiteCompatibilityManifest = () => ExecutiveOperationsSuiteCompatibilityManifest;
export const getExecutiveOperationsSuiteCompatibilityMetadata = () => ExecutiveOperationsSuiteCompatibilityMetadata;
export const getExecutiveOperationsSuiteCompatibilityEntryById = (id: string) => ExecutiveOperationsSuiteCompatibilityRegistry.find((entry) => entry.id === id);
