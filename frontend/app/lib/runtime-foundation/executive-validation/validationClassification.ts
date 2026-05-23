import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ValidationAssertionResult,
  ValidationResultClassification,
  ValidationSeverity,
} from "./executiveValidationTypes.ts";

const SEVERITY_RANK: Record<ValidationSeverity, number> = {
  informational: 1,
  caution: 2,
  warning: 3,
  critical: 4,
};

export function validationSeverityRank(severity: ValidationSeverity): number {
  return SEVERITY_RANK[severity];
}

export function classifyValidationAssertions(
  assertions: readonly ValidationAssertionResult[]
): readonly ValidationResultClassification[] {
  return Object.freeze(
    assertions
      .filter((assertion) => !assertion.passed && !assertion.skipped)
      .map((assertion) => ({
        classificationId: stableSignature([
          "d10-validation-classification",
          assertion.assertionId,
          assertion.component,
          assertion.description,
        ]).slice(0, 56),
        description: assertion.description,
        confidence: assertion.confidence,
        severity: assertion.severity,
        recommendation: assertion.recommendation,
      }))
      .sort((a, b) => validationSeverityRank(b.severity) - validationSeverityRank(a.severity) || a.description.localeCompare(b.description))
  );
}

