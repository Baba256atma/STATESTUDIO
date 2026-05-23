import type {
  ExecutiveValidationScenarioResult,
  ValidationCoverageReport,
} from "./executiveValidationTypes.ts";

export function buildValidationCoverageReport(
  results: readonly ExecutiveValidationScenarioResult[],
  totalScenarioCount: number
): ValidationCoverageReport {
  const executed = results.filter((result) => result.state !== "pending" && result.state !== "running").length;
  const passed = results.filter((result) => result.state === "passed").length;
  const failed = results.filter((result) => result.state === "failed").length;
  const skipped = results.filter((result) => result.state === "skipped").length;
  const coverageScore = Number((totalScenarioCount > 0 ? executed / totalScenarioCount : 0).toFixed(2));
  const indicators = [
    `${executed}/${totalScenarioCount} scenarios executed`,
    `${passed} passed`,
    `${failed} failed`,
    `${skipped} skipped`,
  ];
  return {
    scenarioCount: totalScenarioCount,
    executedScenarios: executed,
    passedScenarios: passed,
    failedScenarios: failed,
    skippedScenarios: skipped,
    coverageScore,
    coverageIndicators: Object.freeze(indicators),
  };
}

