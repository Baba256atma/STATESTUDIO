/** D9:10:8 — MVP pilot feedback capture + executive learning loop types. */

import type { MVPReadinessStatus } from "../../../components/runtime/mvpReadinessDashboardTypes";
import type { MVPDemoModeState } from "../demo-mode/demoModeTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../operationalReliabilityTypes";
import type { MVPSmokeTestSuiteResult } from "../smoke-tests/mvpSmokeTestTypes";

export type FeedbackCategory =
  | "clarity"
  | "trust"
  | "ui_stability"
  | "panel_confusion"
  | "scene_understanding"
  | "decision_value"
  | "data_input"
  | "demo_flow"
  | "unknown";

export type FeedbackSeverity = "low" | "medium" | "high" | "critical";

export type MVPPilotFeedbackCapture = {
  whatConfusedYou?: string;
  whatFeltValuable?: string;
  whatShouldImprove?: string;
  pilotNotes?: string;
};

export type MVPPilotFeedback = {
  feedbackId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  summary: string;
  whatConfusedYou: string;
  whatFeltValuable: string;
  whatShouldImprove: string;
  pilotNotes: string;
  containsSensitivePattern: boolean;
};

export type ExecutiveFeedbackSignal = {
  signalId: string;
  signalKey: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  summary: string;
  occurrenceCount: number;
  generatedAt: number;
};

export type PilotImprovementRecommendation = {
  recommendationId: string;
  priority: number;
  category: FeedbackCategory;
  summary: string;
  rationale: string;
  generatedAt: number;
};

export type PilotLearningSnapshot = {
  feedbackLoopId: string;
  organizationId: string;
  signature: string;
  generatedAt: number;
  summary: string;
  topSignals: readonly string[];
  recommendations: readonly PilotImprovementRecommendation[];
  severity: FeedbackSeverity;
  confidence: number;
  feedbackEntryCount: number;
  executiveSignals: readonly ExecutiveFeedbackSignal[];
  iterationPriorities: readonly string[];
};

export type PilotFeedbackHistoryEntry = {
  entryId: string;
  severity: FeedbackSeverity;
  headline: string;
  generatedAt: number;
};

export type PilotFeedbackStoreState = {
  feedbackEntries: readonly MVPPilotFeedback[];
  learningSnapshots: readonly PilotLearningSnapshot[];
  improvementSignals: readonly ExecutiveFeedbackSignal[];
  feedbackHistory: readonly PilotFeedbackHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};

export type PilotFeedbackLearningLoopInput = {
  organizationId: string;
  demoModeSnapshot?: MVPDemoModeState | null;
  readinessDashboardStatus?: MVPReadinessStatus | null;
  smokeTestSuite?: MVPSmokeTestSuiteResult | null;
  operationalReliabilitySnapshot?: ExecutiveOperationalReliabilitySnapshot | null;
  now?: number;
};

export type PilotFeedbackLearningLoopResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: PilotLearningSnapshot | null;
  storeSignature: string;
};

export type SubmitMVPPilotFeedbackInput = {
  organizationId: string;
  capture: MVPPilotFeedbackCapture;
  now?: number;
};

export type SubmitMVPPilotFeedbackResult = {
  submitted: boolean;
  reason?: string;
  feedback: MVPPilotFeedback | null;
  duplicate: boolean;
};
