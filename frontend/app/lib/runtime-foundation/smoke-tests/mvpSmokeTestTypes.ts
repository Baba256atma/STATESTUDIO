/** D9:10:5 — MVP smoke test harness + executive runtime validation scenario types. */

import type { ExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilityTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { MVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationTypes";

export type MVPSmokeTestScenarioCategory =
  | "analyze_flow"
  | "panel_stability"
  | "scene_stability"
  | "chat_pipeline"
  | "selection_context"
  | "readiness_dashboard"
  | "runtime_trust";

export type MVPSmokeTestStatus = "pass" | "warn" | "fail" | "skipped";

export type MVPSmokeTestScenario = {
  id: string;
  title: string;
  category: MVPSmokeTestScenarioCategory;
  description: string;
  expectedBehavior: string;
  failureIndicators: readonly string[];
};

export type SmokeTestFinding = {
  findingId: string;
  scenarioId: string;
  severity: "low" | "moderate" | "critical";
  summary: string;
  generatedAt: number;
};

export type MVPSmokeTestResult = {
  scenarioId: string;
  status: MVPSmokeTestStatus;
  headline: string;
  detail: string;
  findings: readonly SmokeTestFinding[];
  evaluatedAt: number;
};

export type ExecutiveRuntimeValidationSummary = {
  validationStatus: MVPSmokeTestStatus;
  headline: string;
  passRate: number;
  scenarioCount: number;
  criticalCount: number;
};

export type MVPSmokeTestSuiteResult = {
  suiteId: string;
  organizationId: string;
  status: MVPSmokeTestStatus;
  passed: number;
  warned: number;
  failed: number;
  skipped: number;
  results: readonly MVPSmokeTestResult[];
  validationSummary: ExecutiveRuntimeValidationSummary;
  criticalFindings: readonly SmokeTestFinding[];
  recommendations: readonly string[];
  generatedAt: number;
  signature: string;
};

export type MVPSmokeTestRuntimeContext = {
  organizationId: string;
  foundation: MVPStrategicReadinessSnapshot | null;
  operational: ExecutiveOperationalReliabilitySnapshot | null;
  interaction: ExecutiveInteractionStabilitySnapshot | null;
  foundationSnapshotCount: number;
  operationalSnapshotCount: number;
  interactionSnapshotCount: number;
};

export type MVPSmokeTestSuiteInput = {
  organizationId?: string;
  context?: MVPSmokeTestRuntimeContext;
  now?: number;
};
