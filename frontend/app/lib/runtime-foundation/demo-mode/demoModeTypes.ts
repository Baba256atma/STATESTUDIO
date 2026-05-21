/** D9:10:7 — MVP executive demo mode + controlled pilot presentation types. */

import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";
import type { ExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilityTypes";
import type { MVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationTypes";
import type { LaunchReadinessDecision, MVPProductionReadinessGate } from "../launch-gate/productionReadinessGateTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { MVPSmokeTestSuiteResult } from "../smoke-tests/mvpSmokeTestTypes";

export type MVPDemoState = "disabled" | "monitored" | "demo_ready" | "pilot_ready" | "blocked";

export type DemoModeCategory =
  | "runtime_health"
  | "ui_stability"
  | "launch_gate"
  | "smoke_test"
  | "executive_narrative"
  | "scene_readiness"
  | "panel_readiness"
  | "trust_readiness"
  | "unknown";

export type DemoRiskSeverity = "low" | "moderate" | "critical";

export type DemoRiskIndicator = {
  riskId: string;
  category: DemoModeCategory;
  severity: DemoRiskSeverity;
  summary: string;
  visibleToExecutive: boolean;
  generatedAt: number;
};

export type DemoModeGuardSignal = {
  signalId: string;
  category: DemoModeCategory;
  summary: string;
  blocksDemo: boolean;
  generatedAt: number;
};

export type ExecutiveDemoNarrative = {
  headline: string;
  flow: readonly string[];
  caution: string;
};

export type ExecutiveDemoReadiness = {
  demoState: MVPDemoState;
  launchDecision: LaunchReadinessDecision | "unknown";
  readinessDashboardStatus: MVPReadinessStatus | "unknown";
  evidenceComplete: boolean;
  criticalRiskCount: number;
  headline: string;
};

export type ControlledPilotPresentationSnapshot = {
  presentationId: string;
  pilotState: MVPDemoState;
  summary: string;
  visibleRisks: readonly string[];
  recommendedFocus: readonly string[];
  generatedAt: number;
};

export type MVPDemoModeState = {
  demoModeId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  demoState: MVPDemoState;
  summary: string;
  executiveNarrative: ExecutiveDemoNarrative;
  executiveDemoReadiness: ExecutiveDemoReadiness;
  controlledPilotPresentation: ControlledPilotPresentationSnapshot;
  demoRisks: readonly DemoRiskIndicator[];
  demoGuardSignals: readonly DemoModeGuardSignal[];
  blockedPaths: readonly string[];
  confidence: number;
};

export type DemoModeHistoryEntry = {
  entryId: string;
  demoState: MVPDemoState;
  headline: string;
  generatedAt: number;
};

export type DemoModeStoreState = {
  demoModeSnapshots: readonly MVPDemoModeState[];
  demoRiskHistory: readonly DemoRiskIndicator[];
  pilotObservations: readonly ControlledPilotPresentationSnapshot[];
  demoHistory: readonly DemoModeHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastDemoState: MVPDemoState | null;
};

export type MVPDemoModeInput = {
  organizationId: string;
  productionReadinessGate?: MVPProductionReadinessGate | null;
  mvpStrategicReadinessSnapshot?: MVPStrategicReadinessSnapshot | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  executiveInteractionStabilitySnapshot?: ExecutiveInteractionStabilitySnapshot | null;
  smokeTestSuite?: MVPSmokeTestSuiteResult | null;
  readinessDashboardStatus?: MVPReadinessStatus | null;
  now?: number;
};

export type MVPDemoModeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  demoMode: MVPDemoModeState | null;
  storeSignature: string;
};
