/**
 * DKL-1:6 — Platform Summary.
 *
 * Immutable, deterministic summary of the DKL Foundation platform. Every value
 * is sourced from the DKL-1:5 Manifest summary — nothing is recomputed from
 * internal files. Metadata only — no runtime behavior.
 */

import { getDataKnowledgeFoundationManifestSummary } from "./dataKnowledgeFoundationManifestIndex.ts";
import type { DataKnowledgePlatformSummaryDescriptor } from "./dataKnowledgeFoundationPlatformTypes.ts";

const manifestSummary = getDataKnowledgeFoundationManifestSummary();

export const DataKnowledgeFoundationPlatformSummary = Object.freeze({
  platformId: "DKL-1:6",
  version: "1.0.0",
  phaseCount: manifestSummary.totalPhases,
  sectionCount: manifestSummary.totalPhases + 1,
  publicApiCount: manifestSummary.totalPublicApis,
  validationRuleCount: manifestSummary.totalValidationRules,
  modelCount: manifestSummary.totalModels,
  readiness: "ReadyForCertification",
  certification: "CERTIFIED",
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgePlatformSummaryDescriptor);
