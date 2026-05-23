import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import {
  EXECUTIVE_VALIDATION_SCENARIOS,
  getExecutiveValidationScenarioById,
} from "./executiveValidationRegistry.ts";
import {
  validateJourneyA,
  validateJourneyB,
  validateJourneyC,
  validateJourneyD,
  validateJourneyE,
  validateRuntimeIntegrity,
} from "./executiveJourneyValidators.ts";
import { classifyValidationAssertions } from "./validationClassification.ts";
import { buildValidationCoverageReport } from "./validationCoverage.ts";
import { evaluateProductionCandidateVerification } from "./productionCandidateAdvisory.ts";
import { generateExecutiveValidationSummary } from "./validationSummary.ts";
import type {
  ExecutiveValidationHarnessInput,
  ExecutiveValidationScenario,
  ExecutiveValidationScenarioResult,
  ExecutiveValidationSuiteResult,
  SmokeTestState,
  ValidationAssertionResult,
} from "./executiveValidationTypes.ts";

function assertionsFor(scenario: ExecutiveValidationScenario, input: ExecutiveValidationHarnessInput): readonly ValidationAssertionResult[] {
  if (scenario.journey === "A") return validateJourneyA(input.context);
  if (scenario.journey === "B") return validateJourneyB(input.context);
  if (scenario.journey === "C") return validateJourneyC(input.context);
  if (scenario.journey === "D") return validateJourneyD(input.context);
  if (scenario.journey === "E") return validateJourneyE(input.context);
  return validateRuntimeIntegrity(input.context);
}

function stateFromAssertions(assertions: readonly ValidationAssertionResult[]): SmokeTestState {
  if (assertions.length === 0 || assertions.every((item) => item.skipped)) return "skipped";
  if (assertions.some((item) => !item.passed && item.severity === "critical")) return "failed";
  if (assertions.some((item) => !item.passed)) return "failed";
  return "passed";
}

export function executeExecutiveValidationScenario(
  scenario: ExecutiveValidationScenario,
  input: ExecutiveValidationHarnessInput
): ExecutiveValidationScenarioResult {
  const now = input.now ?? Date.now();
  const assertions = assertionsFor(scenario, input);
  const state = stateFromAssertions(assertions);
  const classifications = classifyValidationAssertions(assertions);
  const failureExplanation = classifications[0]?.description ?? null;
  const signature = stableSignature([
    "d10-executive-validation-scenario",
    scenario.scenarioId,
    state,
    assertions.map((item) => [item.assertionId, item.passed, item.skipped ?? false]),
  ]);

  return {
    scenarioId: scenario.scenarioId,
    state,
    title: scenario.title,
    category: scenario.category,
    assertions,
    failureExplanation,
    classifications,
    executedAt: now,
    signature,
  };
}

export function runExecutiveValidationSuite(
  input: ExecutiveValidationHarnessInput
): ExecutiveValidationSuiteResult {
  const now = input.now ?? Date.now();
  const selected = input.scenarioIds?.length
    ? input.scenarioIds.map((id) => getExecutiveValidationScenarioById(id)).filter((item): item is ExecutiveValidationScenario => Boolean(item))
    : [...EXECUTIVE_VALIDATION_SCENARIOS];
  const results = selected.map((scenario) => executeExecutiveValidationScenario(scenario, { ...input, now }));
  const coverage = buildValidationCoverageReport(results, EXECUTIVE_VALIDATION_SCENARIOS.length);
  const advisory = evaluateProductionCandidateVerification(results, coverage, input.context.dashboard?.launchAssessment ?? "not_ready");
  const summary = generateExecutiveValidationSummary(results, advisory);
  const state: SmokeTestState =
    results.some((result) => result.state === "failed")
      ? "failed"
      : results.some((result) => result.state === "skipped")
        ? "skipped"
        : "passed";
  const signature = stableSignature([
    "d10-executive-validation-suite",
    input.context.organizationId,
    results.map((result) => result.signature),
    advisory,
  ]);

  return {
    suiteId: stableSignature(["d10-executive-validation-suite", input.context.organizationId]).slice(0, 56),
    organizationId: input.context.organizationId,
    state,
    results: Object.freeze(results),
    coverage,
    summary,
    advisory,
    generatedAt: now,
    signature,
  };
}
