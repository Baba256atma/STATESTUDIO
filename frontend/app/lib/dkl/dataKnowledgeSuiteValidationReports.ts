/**
 * DKL-9:4 — Data Knowledge Suite Validation Reports.
 *
 * Canonical validation report and findings. Metadata-only.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

import { DataKnowledgeSuiteModelId } from "./dataKnowledgeSuiteModel.ts";
import { DataKnowledgeSuiteValidationInventory } from "./dataKnowledgeSuiteValidationInventory.ts";
import { DataKnowledgeSuiteValidationRules } from "./dataKnowledgeSuiteValidationRules.ts";
import type {
  DataKnowledgeSuiteValidationFinding,
  DataKnowledgeSuiteValidationOutcome,
  DataKnowledgeSuiteValidationReport,
} from "./dataKnowledgeSuiteValidationTypes.ts";

const findings: readonly DataKnowledgeSuiteValidationFinding[] = Object.freeze(
  DataKnowledgeSuiteValidationRules.map((rule) =>
    Object.freeze({
      findingId: `DKL-9:4/Finding/${rule.id}`,
      ruleId: rule.id,
      category: rule.category,
      severity: rule.severity,
      outcome: rule.outcome,
      message: rule.description,
      expected: rule.expected,
      actual: rule.actual,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ),
);

const canonicalOutcome: DataKnowledgeSuiteValidationOutcome =
  DataKnowledgeSuiteValidationInventory.failedRuleCount === 0 &&
  DataKnowledgeSuiteValidationInventory.passedRuleCount ===
    DataKnowledgeSuiteValidationInventory.ruleCount
    ? "Pass"
    : "Fail";

/** Canonical Suite validation report. */
export const DataKnowledgeSuiteValidationReportRecord: DataKnowledgeSuiteValidationReport =
  Object.freeze({
    reportId: "DKL-9:4/Report/CanonicalSuiteComposition",
    validationId: "DKL-9:4/DataKnowledgeSuiteValidation",
    targetReference: DataKnowledgeSuiteModelId,
    ruleCount: DataKnowledgeSuiteValidationInventory.ruleCount,
    passedRuleCount: DataKnowledgeSuiteValidationInventory.passedRuleCount,
    failedRuleCount: DataKnowledgeSuiteValidationInventory.failedRuleCount,
    warningRuleCount: DataKnowledgeSuiteValidationInventory.warningRuleCount,
    notApplicableRuleCount:
      DataKnowledgeSuiteValidationInventory.notApplicableRuleCount,
    findings,
    outcome: canonicalOutcome,
    readiness: "ReadyForManifest" as const,
    generatesTimestamps: false as const,
    persists: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const DataKnowledgeSuiteValidationFindings = findings;
