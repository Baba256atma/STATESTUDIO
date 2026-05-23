/** D10:9 - Final stabilization checklist and production candidate hardening contracts. */

import type { ExecutiveReadinessDashboardModel } from "../executive-readiness-dashboard/index.ts";
import type { ExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import type { ExecutiveFeedbackLearningResult } from "../executive-feedback-loop/index.ts";
import type { ExecutiveLaunchGateResult } from "../executive-launch-gate/index.ts";
import type { ExecutiveValidationSuiteResult } from "../executive-validation/index.ts";

export type StabilizationChecklistState = "pending" | "verified" | "warning" | "blocked" | "complete";

export type ProductionCandidateArea =
  | "readiness_systems"
  | "trust_systems"
  | "stability_systems"
  | "validation_systems"
  | "executive_workflows"
  | "scenario_workflows"
  | "decision_workflows"
  | "dashboard_systems"
  | "pilot_systems";

export type HardeningFindingSeverity = "informational" | "caution" | "warning" | "critical";

export type ProductionCandidateClassification =
  | "not_ready"
  | "stabilization_required"
  | "nearly_ready"
  | "production_candidate"
  | "publication_ready";

export type StabilizationChecklistItem = {
  itemId: string;
  area: ProductionCandidateArea;
  title: string;
  state: StabilizationChecklistState;
  explanation: string;
  evidence: readonly string[];
  required: boolean;
  signature: string;
};

export type ProductionReviewRegistry = {
  registryId: string;
  organizationId: string;
  items: readonly StabilizationChecklistItem[];
  updatedAt: number;
  signature: string;
};

export type HardeningFinding = {
  findingId: string;
  area: ProductionCandidateArea;
  severity: HardeningFindingSeverity;
  description: string;
  impact: string;
  confidence: number;
  recommendedMitigation: string;
  signature: string;
};

export type ExecutiveWorkflowHardeningReview = {
  reviewId: string;
  stability: StabilizationChecklistState;
  clarity: StabilizationChecklistState;
  explainability: StabilizationChecklistState;
  consistency: StabilizationChecklistState;
  predictability: StabilizationChecklistState;
  confidenceVisibility: StabilizationChecklistState;
  findings: readonly HardeningFinding[];
  signature: string;
};

export type RuntimeReliabilityVerification = {
  verificationId: string;
  stateConsistency: StabilizationChecklistState;
  contextPreservation: StabilizationChecklistState;
  workflowContinuity: StabilizationChecklistState;
  interactionStability: StabilizationChecklistState;
  confidencePropagation: StabilizationChecklistState;
  trustPropagation: StabilizationChecklistState;
  recommendationConsistency: StabilizationChecklistState;
  findings: readonly HardeningFinding[];
  signature: string;
};

export type UXConsistencyAudit = {
  auditId: string;
  panelConsistency: StabilizationChecklistState;
  terminologyConsistency: StabilizationChecklistState;
  navigationConsistency: StabilizationChecklistState;
  workflowConsistency: StabilizationChecklistState;
  executiveClarity: StabilizationChecklistState;
  interactionExpectations: StabilizationChecklistState;
  findings: readonly HardeningFinding[];
  signature: string;
};

export type StabilityRiskInventoryItem = {
  riskId: string;
  description: string;
  severity: HardeningFindingSeverity;
  impact: string;
  confidence: number;
  recommendedMitigation: string;
  source: string;
  signature: string;
};

export type HardeningRecommendation = {
  recommendationId: string;
  area:
    | "stability_improvement"
    | "UX_refinement"
    | "workflow_refinement"
    | "validation_improvement"
    | "trust_improvement"
    | "readiness_improvement";
  priority: number;
  summary: string;
  rationale: string;
  advisoryOnly: true;
  signature: string;
};

export type ExecutiveReadinessVerification = {
  verificationId: string;
  understandSystemStatus: boolean;
  reviewInsights: boolean;
  inspectFragility: boolean;
  exploreScenarios: boolean;
  evaluateRecommendations: boolean;
  interpretConfidence: boolean;
  navigateWorkflows: boolean;
  verifiedCount: number;
  signature: string;
};

export type ProductionHardeningAssessment = {
  assessmentId: string;
  unstablePaths: readonly string[];
  incompleteWorkflows: readonly string[];
  weakValidations: readonly string[];
  ambiguousOutputs: readonly string[];
  fragileInteractions: readonly string[];
  missingSafeguards: readonly string[];
  weakConfidenceVisibility: readonly string[];
  findings: readonly HardeningFinding[];
  signature: string;
};

export type ExecutiveStabilizationSummary = {
  remainingUnstable: readonly string[];
  remainingRisky: readonly string[];
  verified: readonly string[];
  requiresAttention: readonly string[];
  isProductionCandidate: boolean;
  headline: string;
  signature: string;
};

export type HardeningTrendPoint = {
  generatedAt: number;
  stabilityScore: number;
  readinessScore: number;
  trustScore: number;
  validationScore: number;
  issueCount: number;
};

export type HardeningTrendSummary = {
  stabilityImprovements: "improving" | "declining" | "flat";
  readinessImprovements: "improving" | "declining" | "flat";
  trustImprovements: "improving" | "declining" | "flat";
  validationImprovements: "improving" | "declining" | "flat";
  issueReduction: "improving" | "declining" | "flat";
  points: readonly HardeningTrendPoint[];
  signature: string;
};

export type ExecutiveFinalHardeningInput = {
  organizationId?: string;
  dashboard?: ExecutiveReadinessDashboardModel | null;
  validationSuite?: ExecutiveValidationSuiteResult | null;
  launchGate?: ExecutiveLaunchGateResult | null;
  demoPresentation?: ExecutiveDemoModePresentation | null;
  feedbackLearning?: ExecutiveFeedbackLearningResult | null;
  previousTrendPoints?: readonly HardeningTrendPoint[];
  now?: number;
};

export type ExecutiveFinalHardeningResult = {
  hardeningId: string;
  organizationId: string;
  generatedAt: number;
  classification: ProductionCandidateClassification;
  reviewRegistry: ProductionReviewRegistry;
  workflowReview: ExecutiveWorkflowHardeningReview;
  reliabilityVerification: RuntimeReliabilityVerification;
  uxAudit: UXConsistencyAudit;
  assessment: ProductionHardeningAssessment;
  riskInventory: readonly StabilityRiskInventoryItem[];
  executiveVerification: ExecutiveReadinessVerification;
  checklist: readonly StabilizationChecklistItem[];
  recommendations: readonly HardeningRecommendation[];
  summary: ExecutiveStabilizationSummary;
  trend: HardeningTrendSummary;
  signature: string;
};
