/** D9:10:9 — MVP final stabilization checklist + production candidate hardening types. */

import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";
import type { MVPDemoModeState } from "../demo-mode/demoModeTypes";
import type { ExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilityTypes";
import type { MVPProductionReadinessGate } from "../launch-gate/productionReadinessGateTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { PilotLearningSnapshot } from "../feedback-loop/pilotFeedbackTypes";
import type { MVPSmokeTestSuiteResult } from "../smoke-tests/mvpSmokeTestTypes";

export type HardeningCheckCategory =
  | "build_validation"
  | "type_validation"
  | "lint_validation"
  | "runtime_stability"
  | "ui_stability"
  | "panel_stability"
  | "scene_stability"
  | "chat_pipeline"
  | "smoke_tests"
  | "launch_gate"
  | "demo_mode"
  | "feedback_loop"
  | "fallback_safety"
  | "explainability"
  | "trust_readiness";

export type HardeningCheckStatus = "pass" | "warn" | "fail" | "blocked" | "not_checked";

export type MVPReleaseCandidateStatus = "not_ready" | "blocked" | "warn" | "ready" | "not_checked";

export type ProductionCandidateCheck = {
  checkId: string;
  category: HardeningCheckCategory;
  title: string;
  status: HardeningCheckStatus;
  summary: string;
  required: boolean;
};

export type HardeningRisk = {
  riskId: string;
  category: HardeningCheckCategory;
  severity: "low" | "moderate" | "high" | "critical";
  summary: string;
  generatedAt: number;
};

export type FinalStabilizationChecklist = {
  checklistId: string;
  checks: readonly ProductionCandidateCheck[];
  passedCount: number;
  warningCount: number;
  failedCount: number;
  blockedCount: number;
  notCheckedCount: number;
};

export type FinalHardeningSummary = {
  headline: string;
  releaseBlockerCount: number;
  stabilizationWarningCount: number;
  productionCandidateGapCount: number;
  evidenceComplete: boolean;
};

export type MVPFinalHardeningSnapshot = {
  hardeningId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  releaseCandidateStatus: MVPReleaseCandidateStatus;
  summary: string;
  checklist: FinalStabilizationChecklist;
  hardeningSummary: FinalHardeningSummary;
  passedChecks: readonly string[];
  warningChecks: readonly string[];
  blockedChecks: readonly string[];
  failedChecks: readonly string[];
  hardeningRisks: readonly HardeningRisk[];
  recommendedNextChecks: readonly string[];
  confidence: number;
};

export type FinalHardeningHistoryEntry = {
  entryId: string;
  releaseCandidateStatus: MVPReleaseCandidateStatus;
  headline: string;
  generatedAt: number;
};

export type FinalHardeningStoreState = {
  hardeningSnapshots: readonly MVPFinalHardeningSnapshot[];
  checklistHistory: readonly FinalStabilizationChecklist[];
  releaseCandidateHistory: readonly FinalHardeningHistoryEntry[];
  blockerHistory: readonly HardeningRisk[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastReleaseCandidateStatus: MVPReleaseCandidateStatus | null;
};

export type ManualValidationSignals = {
  lintValidation?: HardeningCheckStatus;
  typeValidation?: HardeningCheckStatus;
  buildValidation?: HardeningCheckStatus;
};

export type MVPFinalHardeningInput = {
  organizationId: string;
  readinessDashboardStatus?: MVPReadinessStatus | null;
  smokeTestSuite?: MVPSmokeTestSuiteResult | null;
  productionReadinessGate?: MVPProductionReadinessGate | null;
  demoModeSnapshot?: MVPDemoModeState | null;
  pilotLearningSnapshot?: PilotLearningSnapshot | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  executiveInteractionStabilitySnapshot?: ExecutiveInteractionStabilitySnapshot | null;
  explainabilityAvailable?: boolean;
  manualValidation?: ManualValidationSignals;
  now?: number;
};

export type MVPFinalHardeningResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MVPFinalHardeningSnapshot | null;
  storeSignature: string;
};
