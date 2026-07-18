/**
 * DKL-9:6 — Data Knowledge Suite Platform Dependencies.
 *
 * Declarative platform dependency metadata. Metadata-only.
 *
 * Ownership: owned exclusively by DKL-9:6.
 */

import type { DataKnowledgeSuitePlatformDependency } from "./dataKnowledgeSuitePlatformTypes.ts";

const dependency = (
  order: number,
  dependencyName: string,
  targetPhase: string,
  module: string,
): DataKnowledgeSuitePlatformDependency =>
  Object.freeze({
    dependencyId: `DKL-9:6/Dependency/${String(order).padStart(2, "0")}`,
    dependencyName,
    targetPhase,
    module,
    required: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Platform dependency declarations — Manifest is the sole direct dependency. */
export const DataKnowledgeSuitePlatformDependencies: readonly DataKnowledgeSuitePlatformDependency[] =
  Object.freeze([
    dependency(
      1,
      "Data Knowledge Suite Manifest",
      "DKL-9:5",
      "dataKnowledgeSuiteManifest.ts",
    ),
  ]);
