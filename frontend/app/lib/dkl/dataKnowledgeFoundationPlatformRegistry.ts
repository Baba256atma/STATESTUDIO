/**
 * DKL-1:6 — Platform Registry.
 *
 * Immutable, manifest-driven registry of aggregate DKL Foundation counts.
 * Every value is sourced from the DKL-1:5 Manifest summary — nothing is
 * recomputed from internal files. Metadata only — no runtime behavior.
 */

import { getDataKnowledgeFoundationManifestSummary } from "./dataKnowledgeFoundationManifestIndex.ts";
import type { DataKnowledgePlatformRegistryDescriptor } from "./dataKnowledgeFoundationPlatformTypes.ts";

const manifestSummary = getDataKnowledgeFoundationManifestSummary();

export const DataKnowledgeFoundationPlatformRegistry = Object.freeze({
  registeredPhases: manifestSummary.totalPhases,
  registeredSections: manifestSummary.totalPhases + 1,
  totalPublicApis: manifestSummary.totalPublicApis,
  totalValidationRules: manifestSummary.totalValidationRules,
  totalModels: manifestSummary.totalModels,
  totalComponents: manifestSummary.totalRegistryComponents,
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgePlatformRegistryDescriptor);
