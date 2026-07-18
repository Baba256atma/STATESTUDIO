/**
 * DKL-3:4 — Data Understanding Validation Report.
 *
 * Immutable report descriptors and empty-report template metadata. Report
 * instances are produced by validateDataUnderstandingModel as frozen summaries.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

import { DataUnderstandingValidationRules } from "./dataUnderstandingValidationRules.ts";

/** Canonical immutable validation report descriptor. */
export const DataUnderstandingValidationReport = Object.freeze({
  reportId: "DKL-3:4/DataUnderstandingValidationReport",
  reportName: "Data Understanding Validation Report",
  sourcePhase: "DKL-3:4",
  sections: Object.freeze([
    "identity",
    "status",
    "summary",
    "counts",
    "ruleResults",
    "issues",
    "warnings",
    "metadata",
    "readiness",
  ]),
  sectionCount: 9,
  ruleCount: DataUnderstandingValidationRules.length,
  producesRepairedModels: false,
  producesGeneratedModels: false,
  producesTransformedModels: false,
  producesInferredModels: false,
  metadataOnly: true,
  validationOnly: true,
  immutable: true,
  deterministic: true,
});
