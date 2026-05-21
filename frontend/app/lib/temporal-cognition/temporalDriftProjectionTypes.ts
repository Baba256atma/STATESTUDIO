/** D9:3:4 — Strategic temporal drift projection + enterprise future trajectory awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { CausalDependencySnapshot } from "./causalDependencyTypes";
import type { OrganizationalReplaySnapshot } from "./operationalReplayTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type TrajectoryDirection =
  | "stabilizing"
  | "adaptive_growth"
  | "stagnating"
  | "degrading"
  | "fragile"
  | "unstable"
  | "recovering";

export type TrendStrength = "weak" | "moderate" | "strong" | "accelerating";

export type ProjectionCategory =
  | "fragility"
  | "resilience"
  | "governance"
  | "escalation"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type TrajectoryConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type TemporalDriftProjection = {
  projectionId: string;
  category: ProjectionCategory;
  trajectoryDirection: TrajectoryDirection;
  trendStrength: TrendStrength;
  summary: string;
  supportingSignals: readonly string[];
  confidence: number;
  confidenceLevel: TrajectoryConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseTrajectorySignal = {
  signalId: string;
  category: ProjectionCategory;
  trajectoryDirection: TrajectoryDirection;
  trendStrength: TrendStrength;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalFutureDirection = {
  directionId: string;
  trajectoryDirection: TrajectoryDirection;
  dominantCategory: ProjectionCategory;
  directionSummary: string;
  projectionIds: readonly string[];
  generatedAt: number;
};

export type StrategicEvolutionTrend = {
  trendId: string;
  category: ProjectionCategory;
  trajectoryDirection: TrajectoryDirection;
  trendStrength: TrendStrength;
  evolutionSummary: string;
  linkedProjectionIds: readonly string[];
  generatedAt: number;
};

export type OperationalDriftForecast = {
  forecastId: string;
  category: ProjectionCategory;
  trajectoryDirection: TrajectoryDirection;
  driftSummary: string;
  momentumSignals: readonly string[];
  generatedAt: number;
};

export type TemporalDriftSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  projectionCount: number;
  trajectorySummary: string;
  dominantDirection: TrajectoryDirection;
  dominantCategory: ProjectionCategory;
  dominantTrendStrength: TrendStrength;
  recentProjections: readonly TemporalDriftProjection[];
  trajectorySignals: readonly EnterpriseTrajectorySignal[];
  futureDirections: readonly OrganizationalFutureDirection[];
  evolutionTrends: readonly StrategicEvolutionTrend[];
  driftForecasts: readonly OperationalDriftForecast[];
};

export type TemporalDriftProjectionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  causalSnapshot?: CausalDependencySnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type TemporalDriftProjectionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: TemporalDriftSnapshot | null;
  newProjections: number;
  storeSignature: string;
};

export type TemporalDriftProjectionStoreState = {
  projections: readonly TemporalDriftProjection[];
  snapshots: readonly TemporalDriftSnapshot[];
  signals: readonly EnterpriseTrajectorySignal[];
  futureDirections: readonly OrganizationalFutureDirection[];
  evolutionTrends: readonly StrategicEvolutionTrend[];
  forecasts: readonly OperationalDriftForecast[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
