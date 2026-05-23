/** D10:5 - MVP smoke test harness and executive runtime validation contracts. */

import type {
  ExecutiveReadinessDashboardModel,
} from "../executive-readiness-dashboard/index.ts";
import type {
  ExecutiveReadinessSnapshot,
  RuntimeReadinessRegistry,
} from "../strategic-readiness/index.ts";
import type { ExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import type { ExecutiveInteractionStabilityRuntimeSnapshot } from "../interaction-stability/index.ts";

export type SmokeTestState = "pending" | "running" | "passed" | "failed" | "skipped";

export type ValidationSeverity = "informational" | "caution" | "warning" | "critical";

export type ExecutiveValidationScenarioCategory =
  | "platform_entry"
  | "object_selection"
  | "analysis_workflow"
  | "recommendation_review"
  | "simulation_workflow"
  | "runtime_integrity";

export type ProductionCandidateVerification =
  | "validation_incomplete"
  | "validation_passed_with_warnings"
  | "validation_passed"
  | "production_candidate";

export type ExecutiveValidationContext = {
  organizationId: string;
  readinessRegistry?: RuntimeReadinessRegistry | null;
  readinessSnapshot?: ExecutiveReadinessSnapshot | null;
  reliabilitySnapshot?: ExecutiveReliabilitySnapshot | null;
  interactionSnapshot?: ExecutiveInteractionStabilityRuntimeSnapshot | null;
  dashboard?: ExecutiveReadinessDashboardModel | null;
};

export type ValidationAssertionResult = {
  assertionId: string;
  component: string;
  passed: boolean;
  skipped?: boolean;
  description: string;
  severity: ValidationSeverity;
  confidence: number;
  recommendation: string;
  likelyCause: string | null;
};

export type ExecutiveValidationScenario = {
  scenarioId: string;
  title: string;
  category: ExecutiveValidationScenarioCategory;
  journey: "A" | "B" | "C" | "D" | "E" | "integrity";
  description: string;
  expectedOutcome: string;
  requiredSignals: readonly string[];
};

export type ExecutiveValidationScenarioResult = {
  scenarioId: string;
  state: SmokeTestState;
  title: string;
  category: ExecutiveValidationScenarioCategory;
  assertions: readonly ValidationAssertionResult[];
  failureExplanation: string | null;
  classifications: readonly ValidationResultClassification[];
  executedAt: number;
  signature: string;
};

export type ValidationResultClassification = {
  classificationId: string;
  description: string;
  confidence: number;
  severity: ValidationSeverity;
  recommendation: string;
};

export type ValidationCoverageReport = {
  scenarioCount: number;
  executedScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  skippedScenarios: number;
  coverageScore: number;
  coverageIndicators: readonly string[];
};

export type ExecutiveValidationSummary = {
  validationPassed: boolean;
  highestRisk: ValidationResultClassification | null;
  failedScenarios: readonly string[];
  requiresAttention: readonly string[];
  mvpDemoReady: boolean;
  headline: string;
};

export type ExecutiveValidationSuiteResult = {
  suiteId: string;
  organizationId: string;
  state: SmokeTestState;
  results: readonly ExecutiveValidationScenarioResult[];
  coverage: ValidationCoverageReport;
  summary: ExecutiveValidationSummary;
  advisory: ProductionCandidateVerification;
  generatedAt: number;
  signature: string;
};

export type ExecutiveValidationHarnessInput = {
  context: ExecutiveValidationContext;
  scenarioIds?: readonly string[];
  now?: number;
};

