/** D10:10 - Final MVP completion runtime and publish-ready executive intelligence contracts. */

import type { ExecutiveReadinessDashboardModel } from "../executive-readiness-dashboard/index.ts";
import type { ExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import type { ExecutiveFeedbackLearningResult } from "../executive-feedback-loop/index.ts";
import type { ExecutiveFinalHardeningResult } from "../executive-final-hardening/index.ts";
import type { ExecutiveLaunchGateResult } from "../executive-launch-gate/index.ts";
import type { ExecutiveReliabilitySnapshot } from "../executive-reliability/index.ts";
import type { ExecutiveValidationSuiteResult } from "../executive-validation/index.ts";
import type { ExecutiveInteractionStabilityRuntimeSnapshot } from "../interaction-stability/index.ts";
import type { ExecutiveReadinessSnapshot, RuntimeReadinessRegistry } from "../strategic-readiness/index.ts";

export type MVPCompletionState = "incomplete" | "partially_complete" | "feature_complete" | "MVP_complete" | "publish_ready";

export type PublishReadinessTarget =
  | "internal_demonstrations"
  | "executive_demonstrations"
  | "pilot_programs"
  | "controlled_customer_evaluations"
  | "MVP_publication";

export type PublicationRecommendation =
  | "continue_development"
  | "stabilization_required"
  | "pilot_first"
  | "controlled_release"
  | "publish_MVP";

export type CompletionCapabilityId =
  | "ingestion_workflows"
  | "object_intelligence"
  | "fragility_intelligence"
  | "scenario_simulation"
  | "decision_intelligence"
  | "executive_dashboards"
  | "trust_intelligence"
  | "readiness_intelligence";

export type PublishRiskSeverity = "informational" | "caution" | "warning" | "critical";

export type CompletionEvidenceCategory =
  | "readiness"
  | "validation"
  | "trust"
  | "hardening"
  | "pilot_learning"
  | "governance"
  | "demo"
  | "stability";

export type CompletionEvidenceItem = {
  evidenceId: string;
  category: CompletionEvidenceCategory;
  source: string;
  description: string;
  supportsPublication: boolean;
  confidence: number;
  signature: string;
};

export type PublishReadinessAssessment = {
  target: PublishReadinessTarget;
  ready: boolean;
  rationale: string;
  confidence: number;
};

export type ExecutiveCapabilityVerification = {
  capabilityId: CompletionCapabilityId;
  available: boolean;
  ready: boolean;
  evidence: readonly string[];
  missingOrIncomplete: string | null;
  signature: string;
};

export type MVPCompletionScorecard = {
  readinessScore: number;
  trustScore: number;
  stabilityScore: number;
  validationScore: number;
  pilotScore: number;
  completionScore: number;
  publicationConfidence: number;
};

export type PublishRisk = {
  riskId: string;
  rationale: string;
  severity: PublishRiskSeverity;
  impact: string;
  recommendedAction: string;
  signature: string;
};

export type GovernanceVerification = {
  readinessEvaluationsExist: boolean;
  trustEvaluationsExist: boolean;
  stabilityEvaluationsExist: boolean;
  validationEvaluationsExist: boolean;
  hardeningEvaluationsExist: boolean;
  publicationAssessmentsExist: boolean;
  missingElements: readonly string[];
  signature: string;
};

export type ExecutiveIntelligenceCertification = {
  certificationId: string;
  reliability: boolean;
  explainability: boolean;
  trustworthiness: boolean;
  stability: boolean;
  operationalUsefulness: boolean;
  executiveUsability: boolean;
  certified: boolean;
  evidence: readonly string[];
  signature: string;
};

export type ExecutivePublicationSummary = {
  isMVPComplete: boolean;
  isPublishReady: boolean;
  unresolved: readonly string[];
  risks: readonly string[];
  verifiedStrengths: readonly string[];
  shouldHappenNext: readonly string[];
  headline: string;
  signature: string;
};

export type CompletionTrendPoint = {
  generatedAt: number;
  readinessScore: number;
  trustScore: number;
  validationScore: number;
  stabilityScore: number;
  completionScore: number;
};

export type CompletionTrendSummary = {
  readinessImprovement: "improving" | "declining" | "flat";
  trustImprovement: "improving" | "declining" | "flat";
  validationImprovement: "improving" | "declining" | "flat";
  stabilityImprovement: "improving" | "declining" | "flat";
  completionProgression: "improving" | "declining" | "flat";
  points: readonly CompletionTrendPoint[];
  signature: string;
};

export type PublishReadyDashboard = {
  dashboardId: string;
  organizationId: string;
  generatedAt: number;
  completionStatus: MVPCompletionState;
  readinessStatus: string;
  publicationStatus: PublicationRecommendation;
  riskPosture: PublishRiskSeverity;
  trustPosture: string;
  executiveRecommendations: readonly string[];
  scorecard: MVPCompletionScorecard;
  summary: ExecutivePublicationSummary;
  signature: string;
};

export type ExecutiveMVPCompletionInput = {
  organizationId?: string;
  readinessRegistry?: RuntimeReadinessRegistry | null;
  readinessSnapshot?: ExecutiveReadinessSnapshot | null;
  reliabilitySnapshot?: ExecutiveReliabilitySnapshot | null;
  interactionSnapshot?: ExecutiveInteractionStabilityRuntimeSnapshot | null;
  dashboard?: ExecutiveReadinessDashboardModel | null;
  validationSuite?: ExecutiveValidationSuiteResult | null;
  launchGate?: ExecutiveLaunchGateResult | null;
  demoPresentation?: ExecutiveDemoModePresentation | null;
  feedbackLearning?: ExecutiveFeedbackLearningResult | null;
  finalHardening?: ExecutiveFinalHardeningResult | null;
  previousTrendPoints?: readonly CompletionTrendPoint[];
  now?: number;
};

export type ExecutiveMVPCompletionResult = {
  completionId: string;
  organizationId: string;
  generatedAt: number;
  state: MVPCompletionState;
  publishAssessments: readonly PublishReadinessAssessment[];
  capabilities: readonly ExecutiveCapabilityVerification[];
  scorecard: MVPCompletionScorecard;
  risks: readonly PublishRisk[];
  evidence: readonly CompletionEvidenceItem[];
  governance: GovernanceVerification;
  recommendation: PublicationRecommendation;
  certification: ExecutiveIntelligenceCertification;
  trend: CompletionTrendSummary;
  dashboard: PublishReadyDashboard;
  summary: ExecutivePublicationSummary;
  advisoryOnly: true;
  signature: string;
};
