/** F10:4 — Autonomous strategic foresight + institutional future-state intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

export type InstitutionalTrajectory =
  | "stable"
  | "ascending"
  | "pressurized"
  | "fragile"
  | "adapting";

export type ResilienceTrajectory = "strengthening" | "plateau" | "at_risk" | "recovering";

export type FragilityTrajectory = "reducing" | "stable" | "elevating";

export type GovernanceEvolutionOutlook = "consolidating" | "maturing" | "strained" | "uncertain";

export type StrategicForesightPosture =
  | "idle"
  | "observing"
  | "projecting"
  | "anticipating"
  | "sustained"
  | "attention";

/** Canonical future-state intelligence contract (session-scoped, deterministic, non-predictive). */
export type InstitutionalFutureStateProjection = {
  organizationId: string;
  currentTrajectory: InstitutionalTrajectory;
  possibleFutureStates: readonly string[];
  resilienceTrajectory: ResilienceTrajectory;
  fragilityTrajectory: FragilityTrajectory;
  escalationRisks: readonly string[];
  adaptationOpportunities: readonly string[];
  governanceEvolution: GovernanceEvolutionOutlook;
  timingConsiderations: readonly string[];
  uncertaintyFactors: readonly string[];
  strategicForesightSummary: string;
  confidence: number;
  timestamp: number;
};

export type SynthesizeInstitutionalFutureStateProjectionInput = {
  organizationId: string;
  intelligenceStack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type AutonomousStrategicForesightLayerSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  strategicForesightPosture: StrategicForesightPosture;
  foresightHeadline: string;
  foresightSubline: string;
  trajectoryLine: string;
  resilienceForecastLine: string;
  strategicTimingLine: string;
  uncertaintyFactorsLine: string;
  timelineFutureStateLine: string;
  assistantStrategicForesightLine: string;
  strategicForesightActive: boolean;
  futureStateIntelligenceActive: boolean;
  canonical: InstitutionalFutureStateProjection | null;
  foresightStable: boolean;
};

export const AUTONOMOUS_STRATEGIC_FORESIGHT_SYNC_EVENT =
  "nexora:autonomous-strategic-foresight-sync" as const;
