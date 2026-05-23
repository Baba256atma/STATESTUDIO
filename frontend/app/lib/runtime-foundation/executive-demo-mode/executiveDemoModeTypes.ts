/** D10:7 - Executive demo mode and controlled pilot presentation contracts. */

import type { ExecutiveReadinessDashboardModel } from "../executive-readiness-dashboard/index.ts";
import type { ExecutiveLaunchGateResult } from "../executive-launch-gate/index.ts";
import type { ExecutiveValidationSuiteResult } from "../executive-validation/index.ts";

export type ExecutiveDemoModeState = "disabled" | "demo_mode" | "pilot_mode" | "review_mode";

export type DemoAudience =
  | "executive"
  | "investor"
  | "pilot_participant"
  | "stakeholder"
  | "internal_review";

export type DemoJourneyId =
  | "platform_overview"
  | "object_intelligence"
  | "fragility_analysis"
  | "scenario_simulation"
  | "executive_decision_support";

export type DemoPresentationType =
  | "guided_demonstration"
  | "executive_walkthrough"
  | "investor_demonstration"
  | "pilot_onboarding"
  | "stakeholder_review";

export type DemoSeverity = "informational" | "caution" | "warning" | "critical";

export type DemoSuccessAssessment =
  | "not_ready"
  | "demo_ready_with_warnings"
  | "demo_ready"
  | "pilot_ready";

export type DemoModeTransitionResult = {
  allowed: boolean;
  from: ExecutiveDemoModeState;
  to: ExecutiveDemoModeState;
  reason: string;
  recommendedCorrection: string | null;
  signature: string;
};

export type DemoModeRuntimeState = {
  mode: ExecutiveDemoModeState;
  audience: DemoAudience;
  activeJourneyId: DemoJourneyId | null;
  allowedJourneyIds: readonly DemoJourneyId[];
  blockedJourneyIds: readonly DemoJourneyId[];
  updatedAt: number;
  signature: string;
};

export type DemoScenario = {
  scenarioId: DemoJourneyId;
  title: string;
  presentationType: DemoPresentationType;
  capability: string;
  whyItMatters: string;
  valueProvided: string;
  evidenceRequired: readonly string[];
  supportedModes: readonly ExecutiveDemoModeState[];
  sequence: readonly DemoSequenceStep[];
};

export type DemoSequenceStep = {
  stepId: string;
  title: string;
  focus: string;
  expectedEvidence: readonly string[];
  safeFallback: string;
};

export type GuidedExecutiveJourney = {
  journeyId: DemoJourneyId;
  mode: ExecutiveDemoModeState;
  title: string;
  audience: DemoAudience;
  steps: readonly DemoSequenceStep[];
  presentationFocus: readonly string[];
  blocked: boolean;
  rationale: string;
  signature: string;
};

export type DemoSafetyControl = {
  controlId: string;
  severity: DemoSeverity;
  description: string;
  source: string;
  reversible: true;
  blocksPresentation: boolean;
  recommendedAction: string;
};

export type DemoSafetyEvaluation = {
  safeToPresent: boolean;
  controls: readonly DemoSafetyControl[];
  blockedJourneys: readonly DemoJourneyId[];
  highestSeverity: DemoSeverity;
  signature: string;
};

export type ExecutivePresentationSnapshot = {
  snapshotId: string;
  capabilityDemonstrated: string;
  whyItMatters: string;
  valueProvided: string;
  supportingEvidence: readonly string[];
  exploreNext: readonly string[];
  executiveSummary: string;
  signature: string;
};

export type PilotPresentationPlan = {
  planId: string;
  onboardingVisibility: readonly string[];
  readinessIndicators: readonly string[];
  guidedExploration: readonly DemoJourneyId[];
  featureDiscoverability: readonly string[];
  feedbackPreparation: readonly string[];
  nonDestructive: true;
  signature: string;
};

export type DemoHealthValidation = {
  validationId: string;
  readinessStatus: "available" | "warning" | "blocked";
  trustStatus: "available" | "warning" | "blocked";
  stabilityStatus: "available" | "warning" | "blocked";
  workflowAvailability: "available" | "warning" | "blocked";
  scenarioIntegrity: "available" | "warning" | "blocked";
  warnings: readonly DemoSafetyControl[];
  signature: string;
};

export type ExecutiveDemoNarrative = {
  narrativeId: string;
  operationalSignificance: string;
  strategicImplications: string;
  riskRelevance: string;
  decisionRelevance: string;
  expectedBusinessValue: string;
  groundedEvidence: readonly string[];
  signature: string;
};

export type DemoSuccessEvaluation = {
  assessment: DemoSuccessAssessment;
  presentationQuality: number;
  workflowCoverage: number;
  pilotPreparedness: number;
  confidenceLevel: number;
  warnings: readonly string[];
  advisoryOnly: true;
  signature: string;
};

export type ExecutiveDemoModeInput = {
  organizationId?: string;
  mode: ExecutiveDemoModeState;
  audience?: DemoAudience;
  activeJourneyId?: DemoJourneyId | null;
  requestedJourneyIds?: readonly DemoJourneyId[];
  requestedFeatureFlags?: readonly string[];
  dashboard?: ExecutiveReadinessDashboardModel | null;
  validationSuite?: ExecutiveValidationSuiteResult | null;
  launchGate?: ExecutiveLaunchGateResult | null;
  now?: number;
};

export type ExecutiveDemoModePresentation = {
  presentationId: string;
  organizationId: string;
  generatedAt: number;
  runtimeState: DemoModeRuntimeState;
  safety: DemoSafetyEvaluation;
  journeys: readonly GuidedExecutiveJourney[];
  snapshot: ExecutivePresentationSnapshot;
  pilotPlan: PilotPresentationPlan;
  healthValidation: DemoHealthValidation;
  narrative: ExecutiveDemoNarrative;
  successEvaluation: DemoSuccessEvaluation;
  signature: string;
};
