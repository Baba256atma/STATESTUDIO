/** D9:3:3 — Enterprise operational replay cognition + strategic historical scenario reconstruction types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalRecallSnapshot } from "../institutional-memory/institutionalRecallTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { CausalDependencySnapshot } from "./causalDependencyTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type ReplayCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "resilience"
  | "recovery"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type ReplayProgressionState =
  | "initiated"
  | "developing"
  | "propagating"
  | "destabilizing"
  | "stabilizing"
  | "recovering"
  | "resolved";

export type ReplayConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type OperationalReplaySequence = {
  replayId: string;
  replayCategory: ReplayCategory;
  replayState: ReplayProgressionState;
  summary: string;
  replaySequence: readonly string[];
  linkedTimelineIds: readonly string[];
  linkedCausalChainIds: readonly string[];
  confidence: number;
  confidenceLevel: ReplayConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type HistoricalScenarioReconstruction = {
  scenarioId: string;
  replayCategory: ReplayCategory;
  scenarioTitle: string;
  narrative: string;
  replayIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  generatedAt: number;
};

export type EnterpriseReplayFrame = {
  frameId: string;
  replayCategory: ReplayCategory;
  frameLabel: string;
  progressionSummary: string;
  replayIds: readonly string[];
  sequenceStepCount: number;
  generatedAt: number;
};

export type StrategicReplayEvent = {
  eventId: string;
  replayCategory: ReplayCategory;
  eventLabel: string;
  progressionLabel: string;
  replayId: string;
  observedAt: number;
};

export type OrganizationalReplaySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  replayCount: number;
  scenarioCount: number;
  replaySummary: string;
  dominantCategories: readonly ReplayCategory[];
  dominantReplayState: ReplayProgressionState;
  recentReplays: readonly OperationalReplaySequence[];
  reconstructedScenarios: readonly HistoricalScenarioReconstruction[];
  replayFrames: readonly EnterpriseReplayFrame[];
  strategicEvents: readonly StrategicReplayEvent[];
};

export type OperationalReplayCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  causalSnapshot?: CausalDependencySnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  recallSnapshot?: InstitutionalRecallSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type OperationalReplayCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: OrganizationalReplaySnapshot | null;
  newReplays: number;
  storeSignature: string;
};

export type OperationalReplayStoreState = {
  replays: readonly OperationalReplaySequence[];
  scenarios: readonly HistoricalScenarioReconstruction[];
  frames: readonly EnterpriseReplayFrame[];
  snapshots: readonly OrganizationalReplaySnapshot[];
  strategicEvents: readonly StrategicReplayEvent[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
