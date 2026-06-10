/**
 * Phase 6:5 — Consensus Intelligence Surface contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { ConsensusContext } from "./consensusContextContract.ts";

export const CONSENSUS_INTELLIGENCE_SURFACE_VERSION = "6.5.0";

export const CANONICAL_CONSENSUS_INTELLIGENCE_OWNER = "consensusIntelligenceRuntime";

export const CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID = "consensus_intelligence" as const;

export type ConsensusLevel =
  | "strong_consensus"
  | "moderate_consensus"
  | "mixed_alignment"
  | "low_consensus";

export type AlignmentZoneKind =
  | "executive_alignment"
  | "operational_alignment"
  | "strategic_alignment"
  | "cross_functional_alignment";

export type DisagreementZoneKind =
  | "priority_conflict"
  | "resource_conflict"
  | "timeline_conflict"
  | "governance_conflict";

export type ConvergenceLevel = "growing_convergence" | "stable_convergence" | "weak_convergence";

export type DivergenceLevel = "emerging_divergence" | "increasing_divergence" | "critical_divergence";

export type ConsensusConfidenceLevel = "low" | "moderate" | "high";

export type InstitutionalTensionLevel = "low" | "moderate" | "high" | "critical";

export type ConsensusAttentionLevel =
  | "monitor"
  | "review"
  | "leadership_discussion_recommended"
  | "consensus_escalation";

export type ConsensusLevelCard = Readonly<{
  level: ConsensusLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type AlignmentZoneEntry = Readonly<{
  zone: AlignmentZoneKind;
  label: string;
  status: string;
  summary: string;
}>;

export type AlignmentZonesCard = Readonly<{
  zones: readonly AlignmentZoneEntry[];
  summary: string;
}>;

export type DisagreementZoneEntry = Readonly<{
  zone: DisagreementZoneKind;
  label: string;
  status: string;
  summary: string;
}>;

export type DisagreementZonesCard = Readonly<{
  zones: readonly DisagreementZoneEntry[];
  summary: string;
}>;

export type ConvergenceCard = Readonly<{
  level: ConvergenceLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type DivergenceCard = Readonly<{
  level: DivergenceLevel;
  label: string;
  trend: ImpactDirection;
  summary: string;
}>;

export type InstitutionalTensionCard = Readonly<{
  level: InstitutionalTensionLevel;
  label: string;
  visibility: string;
  summary: string;
}>;

export type ConsensusConfidenceCard = Readonly<{
  level: ConsensusConfidenceLevel;
  label: string;
  metadata: string;
  summary: string;
}>;

export type ConsensusAttentionCard = Readonly<{
  level: ConsensusAttentionLevel;
  label: string;
  escalationIndicator: string;
  discussionIndicator: string;
  summary: string;
}>;

export type ConsensusIntelligenceSnapshot = Readonly<{
  consensusLevel: ConsensusLevelCard;
  alignmentZones: AlignmentZonesCard;
  disagreementZones: DisagreementZonesCard;
  convergence: ConvergenceCard;
  divergence: DivergenceCard;
  institutionalTension: InstitutionalTensionCard;
  consensusConfidence: ConsensusConfidenceCard;
  consensusAttention: ConsensusAttentionCard;
}>;

export type ConsensusIntelligenceAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type ConsensusIntelligenceSurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID;
  owner: typeof CANONICAL_CONSENSUS_INTELLIGENCE_OWNER;
  headline: string;
  consensusContext: ConsensusContext;
  snapshot: ConsensusIntelligenceSnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
}>;
