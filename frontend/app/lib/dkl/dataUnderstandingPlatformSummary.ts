/**
 * DKL-3:6 — Data Understanding Platform Summary.
 *
 * Immutable platform summary totals. Deterministic metadata only.
 * Totals are stable explicit values aligned with prior-phase inventories.
 *
 * Ownership: owned exclusively by DKL-3:6.
 */

import type { PlatformSummaryDescriptor } from "./dataUnderstandingPlatformTypes.ts";

/**
 * Stable explicit totals:
 * - components: 6 (Foundation…Platform)
 * - registries: 1
 * - models: 17 (DKL-3:3 model kinds)
 * - validation rules: 28
 * - dependencies: 7 (Pipeline, DKL-2, DKL-3:1–5)
 * - public APIs: 48 (6 phases × 8)
 * - references: 4
 * - inventories: 1
 * - metadata objects: 30 (6 components + 7 dependencies + 17 models)
 */
export const DataUnderstandingPlatformSummary: PlatformSummaryDescriptor = Object.freeze({
  totalComponents: 6,
  totalRegistries: 1,
  totalModels: 17,
  totalValidationRules: 28,
  totalDependencies: 7,
  totalPublicApis: 48,
  totalReferences: 4,
  totalInventories: 1,
  totalMetadataObjects: 30,
  namespaceSectionCount: 5,
  phasesCompleted: 5,
  platformId: "DKL-3",
  nextPhase: "DKL-3:7",
});
