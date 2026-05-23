/** D10:2 - Executive operational reliability and runtime trust contracts. */

import type { ConfidenceLevel } from "../../confidence/decisionConfidenceTypes.ts";
import type { RuntimeReadinessRegistry } from "../strategic-readiness/index.ts";

export type ReliabilityState = "stable" | "degraded" | "unstable" | "recovering";

export type TrustRiskSeverity = "informational" | "caution" | "warning" | "critical";

export type ExecutiveTrustSourceType =
  | "simulation_output"
  | "decision_recommendation"
  | "fragility_assessment"
  | "executive_summary"
  | "panel_narrative"
  | "operational_insight";

export type RuntimeValidationState = "valid" | "warning" | "invalid" | "unknown";

export type ExecutiveTrustArtifact = {
  artifactId: string;
  sourceType: ExecutiveTrustSourceType;
  title: string;
  conclusion: string;
  recommendation?: string | null;
  confidenceScore: number;
  confidenceLevel?: ConfidenceLevel | null;
  validationState?: RuntimeValidationState;
  generatedAt: number;
  observedAt?: number;
  supportingFactors?: readonly string[];
  warningIndicators?: readonly string[];
  contractValid?: boolean;
  executionChainComplete?: boolean;
};

export type ExecutiveTrustEvaluation = {
  evaluationId: string;
  artifactId: string;
  sourceType: ExecutiveTrustSourceType;
  trustScore: number;
  confidenceLevel: ConfidenceLevel;
  reliabilityState: ReliabilityState;
  supportingFactors: readonly string[];
  warningIndicators: readonly string[];
  generatedAt: number;
  signature: string;
};

export type ConsistencyIssueType =
  | "conflicting_conclusions"
  | "contradictory_recommendations"
  | "stale_intelligence"
  | "invalid_state_propagation"
  | "mismatched_confidence"
  | "incomplete_execution_chain";

export type RuntimeConsistencyIssue = {
  issueId: string;
  issueType: ConsistencyIssueType;
  sourceArtifactIds: readonly string[];
  explanation: string;
  severity: TrustRiskSeverity;
  recommendedNextAction: string;
};

export type RuntimeConsistencyAnalysis = {
  consistent: boolean;
  issues: readonly RuntimeConsistencyIssue[];
  generatedAt: number;
  signature: string;
};

export type TrustRiskClassification = {
  riskId: string;
  severity: TrustRiskSeverity;
  source: string;
  reason: string;
  recommendedNextAction: string;
};

export type RuntimeStateCheck = {
  checkId: string;
  label: string;
  state: ReliabilityState;
  confidence: number;
  reason: string;
};

export type ExecutiveReliabilityAggregationInput = {
  organizationId?: string;
  readinessRegistry?: RuntimeReadinessRegistry | null;
  artifacts?: readonly ExecutiveTrustArtifact[];
  validationResults?: readonly RuntimeStateCheck[];
  confidenceSignals?: readonly { signalId: string; confidenceScore: number; label: string }[];
  panelContractValid?: boolean | null;
  sceneSynchronized?: boolean | null;
  previousSnapshots?: readonly ExecutiveReliabilitySnapshot[];
  now?: number;
};

export type ReliabilityTrendPoint = {
  generatedAt: number;
  trustScore: number;
  reliabilityState: ReliabilityState;
  confidenceLevel: ConfidenceLevel;
};

export type ReliabilityTrendSummary = {
  direction: "improving" | "declining" | "flat" | "recovering";
  trustScoreDelta: number;
  confidenceDrift: "up" | "down" | "flat";
  stabilityChanged: boolean;
  points: readonly ReliabilityTrendPoint[];
};

export type ExecutiveReliabilitySummary = {
  reliabilityState: ReliabilityState;
  platformBehavingNormally: boolean;
  trustScore: number;
  confidenceLevel: ConfidenceLevel;
  highestTrustRisk: TrustRiskClassification | null;
  riskCount: number;
  issueCount: number;
};

export type ExecutiveReliabilitySnapshot = {
  snapshotId: string;
  organizationId: string;
  generatedAt: number;
  answer: string;
  canTrustResult: boolean;
  platformBehavingNormally: boolean;
  concerns: readonly string[];
  highestTrustRisk: TrustRiskClassification | null;
  shouldHappenNext: readonly string[];
  summary: ExecutiveReliabilitySummary;
  evaluations: readonly ExecutiveTrustEvaluation[];
  consistency: RuntimeConsistencyAnalysis;
  risks: readonly TrustRiskClassification[];
  trend: ReliabilityTrendSummary;
  signature: string;
};

