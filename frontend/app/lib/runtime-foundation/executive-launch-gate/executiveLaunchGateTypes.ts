/** D10:6 - MVP production readiness gate and executive launch decision contracts. */

import type {
  ExecutiveReadinessDashboardModel,
} from "../executive-readiness-dashboard/index.ts";
import type { ExecutiveValidationSuiteResult } from "../executive-validation/index.ts";
import type { ExecutiveReadinessSnapshot, RuntimeReadinessRegistry } from "../strategic-readiness/index.ts";
import type { ExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import type { ExecutiveInteractionStabilityRuntimeSnapshot } from "../interaction-stability/index.ts";

export type ProductionReadinessGateState =
  | "blocked"
  | "not_ready"
  | "conditionally_ready"
  | "pilot_ready"
  | "release_candidate";

export type ExecutiveLaunchRecommendation =
  | "do_not_launch"
  | "launch_after_remediation"
  | "pilot_launch_recommended"
  | "controlled_release_recommended"
  | "MVP_release_candidate";

export type GovernanceClassificationSeverity =
  | "informational"
  | "caution"
  | "warning"
  | "critical"
  | "launch_blocker";

export type LaunchBlockerSeverity = "major" | "critical" | "launch_blocker";

export type LaunchEvidenceCategory =
  | "readiness"
  | "trust"
  | "stability"
  | "validation"
  | "dashboard"
  | "risk";

export type LaunchEvidenceItem = {
  evidenceId: string;
  category: LaunchEvidenceCategory;
  source: string;
  description: string;
  confidence: number;
  supportsLaunch: boolean;
  signature: string;
};

export type LaunchBlockingItem = {
  blockerId: string;
  description: string;
  severity: LaunchBlockerSeverity;
  affectedCapability: string;
  rationale: string;
  recommendedResolution: string;
};

export type PrioritizedReadinessRisk = {
  riskId: string;
  description: string;
  priorityScore: number;
  businessImpact: number;
  executiveTrustImpact: number;
  workflowImpact: number;
  operationalImpact: number;
  validationSeverity: number;
  recommendedAction: string;
};

export type GovernanceClassification = {
  classificationId: string;
  severity: GovernanceClassificationSeverity;
  explanation: string;
  source: string;
  confidence: number;
  recommendedAction: string;
};

export type LaunchReadinessScorecard = {
  readinessScore: number;
  trustScore: number;
  stabilityScore: number;
  validationScore: number;
  launchConfidence: number;
  unresolvedRiskCount: number;
};

export type LaunchDecisionExplainability = {
  supportingEvidence: readonly LaunchEvidenceItem[];
  strengths: readonly string[];
  weaknesses: readonly string[];
  risks: readonly PrioritizedReadinessRisk[];
  readinessRationale: string;
  confidence: number;
};

export type ExecutiveLaunchSummary = {
  isNexoraReady: boolean;
  launchBlockers: readonly string[];
  remainingRisks: readonly string[];
  supportingEvidence: readonly string[];
  shouldHappenNext: readonly string[];
  headline: string;
};

export type ExecutiveLaunchGateInput = {
  organizationId?: string;
  readinessRegistry?: RuntimeReadinessRegistry | null;
  readinessSnapshot?: ExecutiveReadinessSnapshot | null;
  reliabilitySnapshot?: ExecutiveReliabilitySnapshot | null;
  interactionSnapshot?: ExecutiveInteractionStabilityRuntimeSnapshot | null;
  dashboard?: ExecutiveReadinessDashboardModel | null;
  validationSuite?: ExecutiveValidationSuiteResult | null;
  now?: number;
};

export type ExecutiveLaunchGateResult = {
  gateId: string;
  organizationId: string;
  generatedAt: number;
  state: ProductionReadinessGateState;
  recommendation: ExecutiveLaunchRecommendation;
  advisoryOnly: true;
  scorecard: LaunchReadinessScorecard;
  evidence: readonly LaunchEvidenceItem[];
  blockers: readonly LaunchBlockingItem[];
  classifications: readonly GovernanceClassification[];
  explainability: LaunchDecisionExplainability;
  summary: ExecutiveLaunchSummary;
  signature: string;
};

