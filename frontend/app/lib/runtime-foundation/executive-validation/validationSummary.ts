import type {
  ExecutiveValidationScenarioResult,
  ExecutiveValidationSummary,
  ProductionCandidateVerification,
} from "./executiveValidationTypes.ts";
import { validationSeverityRank } from "./validationClassification.ts";

export function generateExecutiveValidationSummary(
  results: readonly ExecutiveValidationScenarioResult[],
  advisory: ProductionCandidateVerification
): ExecutiveValidationSummary {
  const classifications = results.flatMap((result) => result.classifications);
  const highestRisk = [...classifications].sort((a, b) => validationSeverityRank(b.severity) - validationSeverityRank(a.severity))[0] ?? null;
  const failedScenarios = results.filter((result) => result.state === "failed").map((result) => result.title);
  const requiresAttention = highestRisk
    ? Array.from(new Set(classifications.slice(0, 5).map((item) => item.recommendation)))
    : ["No immediate validation action is required."];
  const validationPassed = failedScenarios.length === 0 && results.every((result) => result.state === "passed");
  const mvpDemoReady = validationPassed && (advisory === "validation_passed" || advisory === "production_candidate");

  return {
    validationPassed,
    highestRisk,
    failedScenarios: Object.freeze(failedScenarios),
    requiresAttention: Object.freeze(requiresAttention),
    mvpDemoReady,
    headline: mvpDemoReady
      ? "MVP validation passed for executive demo readiness."
      : "MVP validation requires attention before executive demo.",
  };
}

