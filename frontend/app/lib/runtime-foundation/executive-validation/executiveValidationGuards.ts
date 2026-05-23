import type {
  ExecutiveValidationScenarioResult,
  ExecutiveValidationSuiteResult,
  ValidationAssertionResult,
  ValidationCoverageReport,
} from "./executiveValidationTypes.ts";

function validConfidence(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateValidationAssertionResult(
  assertion: ValidationAssertionResult | null | undefined
): assertion is ValidationAssertionResult {
  if (!assertion) return false;
  return Boolean(assertion.assertionId.trim() && assertion.component.trim() && assertion.description.trim() && assertion.recommendation.trim() && validConfidence(assertion.confidence));
}

export function validateExecutiveValidationScenarioResult(
  result: ExecutiveValidationScenarioResult | null | undefined
): result is ExecutiveValidationScenarioResult {
  if (!result) return false;
  return Boolean(result.scenarioId.trim() && result.title.trim() && result.signature.trim() && Number.isFinite(result.executedAt) && result.assertions.every(validateValidationAssertionResult));
}

export function validateValidationCoverageReport(
  coverage: ValidationCoverageReport | null | undefined
): coverage is ValidationCoverageReport {
  if (!coverage) return false;
  return coverage.scenarioCount >= 0 && coverage.executedScenarios >= 0 && validConfidence(coverage.coverageScore);
}

export function validateExecutiveValidationSuiteResult(
  suite: ExecutiveValidationSuiteResult | null | undefined
): suite is ExecutiveValidationSuiteResult {
  if (!suite) return false;
  return Boolean(
    suite.suiteId.trim() &&
      suite.organizationId.trim() &&
      suite.signature.trim() &&
      Number.isFinite(suite.generatedAt) &&
      suite.results.every(validateExecutiveValidationScenarioResult) &&
      validateValidationCoverageReport(suite.coverage)
  );
}

