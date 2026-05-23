export type {
  ExecutiveValidationContext,
  ExecutiveValidationHarnessInput,
  ExecutiveValidationScenario,
  ExecutiveValidationScenarioCategory,
  ExecutiveValidationScenarioResult,
  ExecutiveValidationSuiteResult,
  ExecutiveValidationSummary,
  ProductionCandidateVerification,
  SmokeTestState,
  ValidationAssertionResult,
  ValidationCoverageReport,
  ValidationResultClassification,
  ValidationSeverity,
} from "./executiveValidationTypes.ts";

export {
  EXECUTIVE_VALIDATION_SCENARIOS,
  getExecutiveValidationScenarioById,
} from "./executiveValidationRegistry.ts";

export {
  validateJourneyA,
  validateJourneyB,
  validateJourneyC,
  validateJourneyD,
  validateJourneyE,
  validateRuntimeIntegrity,
} from "./executiveJourneyValidators.ts";

export {
  executeExecutiveValidationScenario,
  runExecutiveValidationSuite,
} from "./validationHarness.ts";

export {
  classifyValidationAssertions,
  validationSeverityRank,
} from "./validationClassification.ts";

export { buildValidationCoverageReport } from "./validationCoverage.ts";
export { evaluateProductionCandidateVerification } from "./productionCandidateAdvisory.ts";
export { generateExecutiveValidationSummary } from "./validationSummary.ts";

export {
  validateExecutiveValidationScenarioResult,
  validateExecutiveValidationSuiteResult,
  validateValidationAssertionResult,
  validateValidationCoverageReport,
} from "./executiveValidationGuards.ts";

