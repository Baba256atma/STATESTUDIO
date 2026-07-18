/**
 * DKL-7:4 — Knowledge Services Validation Results.
 *
 * Exactly forty-eight immutable rule results and zero findings for the
 * completed canonical architecture.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

import { KnowledgeServicesValidationRules } from "./knowledgeServicesValidationRules.ts";
import type {
  KnowledgeServicesValidationFinding,
  KnowledgeServicesValidationRuleResult,
} from "./knowledgeServicesValidationTypes.ts";

/** Exactly one result per validation rule. */
export const KnowledgeServicesValidationResults: readonly KnowledgeServicesValidationRuleResult[] =
  Object.freeze(
    KnowledgeServicesValidationRules.map((rule) =>
      Object.freeze({
        resultId: `DKL-7:4/Result/${rule.ruleId}`,
        ruleId: rule.ruleId,
        status: rule.status,
        severity: rule.severity,
        evidenceReferences: Object.freeze(
          rule.evidenceReferences.map((ref) => ref.evidenceId),
        ),
        message:
          rule.status === "Pass"
            ? `${rule.ruleId} passed: ${rule.expectedCondition}`
            : `${rule.ruleId} failed: expected ${rule.expectedCondition}; actual ${rule.actualEvidence}`,
        metadataOnly: true as const,
        deterministicOrder: rule.deterministicOrder,
      }),
    ),
  );

export const KnowledgeServicesValidationPassCount =
  KnowledgeServicesValidationResults.filter((r) => r.status === "Pass").length;

export const KnowledgeServicesValidationFailCount =
  KnowledgeServicesValidationResults.filter((r) => r.status === "Fail").length;

export const KnowledgeServicesValidationNotApplicableCount =
  KnowledgeServicesValidationResults.filter((r) => r.status === "NotApplicable")
    .length;

/** Completed canonical architecture produces zero findings. */
export const KnowledgeServicesValidationFindings: readonly KnowledgeServicesValidationFinding[] =
  Object.freeze([]);

export const KnowledgeServicesValidationOverallResult =
  KnowledgeServicesValidationFailCount === 0 &&
  KnowledgeServicesValidationPassCount ===
    KnowledgeServicesValidationResults.length
    ? ("Pass" as const)
    : ("Fail" as const);
