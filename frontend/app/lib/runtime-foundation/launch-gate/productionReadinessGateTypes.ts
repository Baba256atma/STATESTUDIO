/** D9:10:6 — MVP production readiness gate + executive launch decision types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../enterprise/governance/adaptiveGovernanceTypes";
import type { ExecutiveInteractionStabilitySnapshot } from "../executiveInteractionStabilityTypes";
import type { MVPStrategicReadinessSnapshot } from "../enterpriseRuntimeFoundationTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { MVPSmokeTestSuiteResult } from "../smoke-tests/mvpSmokeTestTypes";
import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";

export type LaunchReadinessDecision =
  | "no_go"
  | "conditional_go"
  | "go_for_demo"
  | "go_for_controlled_pilot";

export type ProductionReadinessCategory =
  | "runtime_stability"
  | "ui_stability"
  | "panel_stability"
  | "scene_stability"
  | "chat_pipeline_stability"
  | "smoke_test_status"
  | "executive_trust"
  | "explainability"
  | "fallback_safety";

export type LaunchBlockerSeverity = "critical" | "high";

export type LaunchBlocker = {
  blockerId: string;
  category: ProductionReadinessCategory;
  severity: LaunchBlockerSeverity;
  summary: string;
  remediation: string;
  generatedAt: number;
};

export type LaunchRiskSeverity = "minor" | "moderate" | "major";

export type LaunchRisk = {
  riskId: string;
  category: ProductionReadinessCategory;
  severity: LaunchRiskSeverity;
  summary: string;
  generatedAt: number;
};

export type ExecutiveLaunchRecommendation = {
  decision: LaunchReadinessDecision;
  headline: string;
  rationale: string;
  evidenceComplete: boolean;
  falseReadyPrevented: boolean;
};

export type ProductionReadinessSummary = {
  readinessStatus: MVPReadinessStatus;
  smokeSuiteStatus: string;
  trustState: string;
  uiState: string;
  foundationRuntimeStatus: string;
  evidenceDepth: "none" | "partial" | "full";
  categoryPosture: Record<ProductionReadinessCategory, "blocked" | "at_risk" | "acceptable" | "unknown">;
};

export type MVPProductionReadinessGate = {
  gateId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  decision: LaunchReadinessDecision;
  summary: string;
  blockers: readonly LaunchBlocker[];
  risks: readonly LaunchRisk[];
  recommendedNextChecks: readonly string[];
  launchRecommendation: ExecutiveLaunchRecommendation;
  readinessSummary: ProductionReadinessSummary;
  confidence: number;
};

export type ProductionReadinessGateHistoryEntry = {
  entryId: string;
  decision: LaunchReadinessDecision;
  blockerCount: number;
  headline: string;
  generatedAt: number;
};

export type ProductionReadinessGateState = {
  readinessGates: readonly MVPProductionReadinessGate[];
  blockerHistory: readonly LaunchBlocker[];
  launchRiskHistory: readonly LaunchRisk[];
  gateHistory: readonly ProductionReadinessGateHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastLaunchDecision: LaunchReadinessDecision | null;
};

export type MVPProductionReadinessGateInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  mvpStrategicReadinessSnapshot?: MVPStrategicReadinessSnapshot | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  executiveInteractionStabilitySnapshot?: ExecutiveInteractionStabilitySnapshot | null;
  smokeTestSuite?: MVPSmokeTestSuiteResult | null;
  readinessDashboardStatus?: MVPReadinessStatus | null;
  explainabilityAvailable?: boolean;
  now?: number;
};

export type MVPProductionReadinessGateResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  gate: MVPProductionReadinessGate | null;
  blockerCount: number;
  storeSignature: string;
};
