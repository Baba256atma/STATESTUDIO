/** D9:10:10 — Final MVP completion runtime + publish-ready executive intelligence types. */

import type { MVPDemoModeState } from "../demo-mode/demoModeTypes";
import type { ExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilityTypes";
import type { MVPFinalHardeningSnapshot } from "../final-hardening/finalStabilizationChecklistTypes";
import type { MVPProductionReadinessGate } from "../launch-gate/productionReadinessGateTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { PilotLearningSnapshot } from "../feedback-loop/pilotFeedbackTypes";
import type { MVPSmokeTestSuiteResult } from "../smoke-tests/mvpSmokeTestTypes";

export type PublishReadyStatus =
  | "not_ready"
  | "blocked"
  | "demo_ready"
  | "pilot_ready"
  | "publish_candidate";

export type MVPCompletionSignalCategory =
  | "hardening"
  | "launch_gate"
  | "demo_mode"
  | "smoke_tests"
  | "runtime_trust"
  | "ui_stability"
  | "feedback_loop"
  | "publish_readiness"
  | "unknown";

export type MVPCompletionSignal = {
  signalId: string;
  category: MVPCompletionSignalCategory;
  summary: string;
  supportive: boolean;
  generatedAt: number;
};

export type FinalLaunchRisk = {
  riskId: string;
  category: MVPCompletionSignalCategory;
  severity: "low" | "moderate" | "high";
  summary: string;
  generatedAt: number;
};

export type ExecutivePublishReadinessSummary = {
  headline: string;
  launchPosture: PublishReadyStatus;
  blockerCount: number;
  riskCount: number;
  evidenceComplete: boolean;
  controlledMvpOnly: boolean;
};

export type FinalMVPCompletionSnapshot = {
  finalMVPId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  publishReadyStatus: PublishReadyStatus;
  summary: string;
  blockers: readonly string[];
  risks: readonly string[];
  recommendedNextAction: string;
  executivePublishReadiness: ExecutivePublishReadinessSummary;
  completionSignals: readonly MVPCompletionSignal[];
  confidence: number;
};

export type FinalMVPCompletionHistoryEntry = {
  entryId: string;
  publishReadyStatus: PublishReadyStatus;
  headline: string;
  generatedAt: number;
};

export type FinalMVPCompletionStoreState = {
  completionSnapshots: readonly FinalMVPCompletionSnapshot[];
  readinessHistory: readonly FinalMVPCompletionHistoryEntry[];
  blockerHistory: readonly string[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastPublishReadyStatus: PublishReadyStatus | null;
};

export type FinalMVPCompletionInput = {
  organizationId: string;
  finalHardeningSnapshot?: MVPFinalHardeningSnapshot | null;
  productionReadinessGate?: MVPProductionReadinessGate | null;
  demoModeSnapshot?: MVPDemoModeState | null;
  smokeTestSuite?: MVPSmokeTestSuiteResult | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  executiveInteractionStabilitySnapshot?: ExecutiveInteractionStabilitySnapshot | null;
  pilotLearningSnapshot?: PilotLearningSnapshot | null;
  now?: number;
};

export type FinalMVPCompletionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: FinalMVPCompletionSnapshot | null;
  storeSignature: string;
};
