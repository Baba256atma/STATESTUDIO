/** D9:3:5 — Strategic multi-timeline divergence + enterprise alternative evolution path types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { CausalDependencySnapshot } from "./causalDependencyTypes";
import type { OrganizationalReplaySnapshot } from "./operationalReplayTypes";
import type { TemporalDriftSnapshot } from "./temporalDriftProjectionTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type BranchCategory =
  | "stabilization"
  | "escalation"
  | "resilience_growth"
  | "governance_recovery"
  | "operational_stagnation"
  | "systemic_fragility"
  | "adaptive_evolution"
  | "unknown";

export type DivergenceStrength = "weak" | "moderate" | "strong" | "accelerating";

export type BranchState = "emerging" | "diverging" | "stabilizing" | "escalating" | "converging";

export type OrganizationalTimelineBranch = {
  branchId: string;
  branchType: BranchCategory;
  branchState: BranchState;
  indicators: readonly string[];
  summary: string;
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
};

export type EnterpriseDivergencePath = {
  divergenceId: string;
  dominantBranch: BranchCategory;
  divergenceStrength: DivergenceStrength;
  summary: string;
  branches: readonly OrganizationalTimelineBranch[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type AlternativeEvolutionTrajectory = {
  trajectoryId: string;
  branchType: BranchCategory;
  evolutionSummary: string;
  linkedBranchIds: readonly string[];
  divergenceStrength: DivergenceStrength;
  generatedAt: number;
};

export type StrategicBranchingSequence = {
  sequenceId: string;
  fromBranch: BranchCategory;
  toBranch: BranchCategory;
  branchingSummary: string;
  linkedDivergenceIds: readonly string[];
  generatedAt: number;
};

export type TemporalDivergenceSignal = {
  signalId: string;
  branchType: BranchCategory;
  divergenceStrength: DivergenceStrength;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type MultiTimelineSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  divergenceCount: number;
  branchCount: number;
  divergenceSummary: string;
  dominantBranch: BranchCategory;
  dominantDivergenceStrength: DivergenceStrength;
  recentDivergencePaths: readonly EnterpriseDivergencePath[];
  timelineBranches: readonly OrganizationalTimelineBranch[];
  alternativeTrajectories: readonly AlternativeEvolutionTrajectory[];
  branchingSequences: readonly StrategicBranchingSequence[];
  divergenceSignals: readonly TemporalDivergenceSignal[];
};

export type MultiTimelineDivergenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  causalSnapshot?: CausalDependencySnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type MultiTimelineDivergenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MultiTimelineSnapshot | null;
  newDivergencePaths: number;
  storeSignature: string;
};

export type MultiTimelineStoreState = {
  divergencePaths: readonly EnterpriseDivergencePath[];
  branches: readonly OrganizationalTimelineBranch[];
  snapshots: readonly MultiTimelineSnapshot[];
  alternativeTrajectories: readonly AlternativeEvolutionTrajectory[];
  branchingSequences: readonly StrategicBranchingSequence[];
  signals: readonly TemporalDivergenceSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
