/** F9:2 — Strategic alignment integrity + enterprise coherence cognition types. */

import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";

export type CoherenceStrategicAlignment =
  | "fragmented"
  | "forming"
  | "tracking"
  | "harmonized";

export type OperationalConsistency = "inconsistent" | "forming" | "consistent" | "strained";

export type GovernanceSynchronization = "desynchronized" | "forming" | "synchronized" | "coherent";

export type ResilienceCoherence = "discontinuous" | "forming" | "aligned" | "mature";

export type CoordinationIntegrity = "fragmented" | "forming" | "integrated" | "stable";

export type AdaptationAlignment = "conflicted" | "forming" | "aligned" | "sustained";

export type InstitutionalHarmony = "strained" | "forming" | "harmonious" | "stable";

export type CoherencePosture =
  | "idle"
  | "observing"
  | "aligning"
  | "synchronized"
  | "harmonized"
  | "attention";

/** Canonical enterprise strategic coherence contract (session-scoped, deterministic). */
export type EnterpriseStrategicCoherence = {
  organizationId: string;
  strategicAlignment: CoherenceStrategicAlignment;
  operationalConsistency: OperationalConsistency;
  governanceSynchronization: GovernanceSynchronization;
  resilienceCoherence: ResilienceCoherence;
  coordinationIntegrity: CoordinationIntegrity;
  adaptationAlignment: AdaptationAlignment;
  institutionalHarmony: InstitutionalHarmony;
  confidence: number;
  timestamp: number;
};

export type SynthesizeEnterpriseStrategicCoherenceInput = {
  organizationId: string;
  adaptiveGovernance: AdaptiveGovernanceCognition | null;
  governanceOversightActive: boolean;
  enterpriseSelfCalibrationActive: boolean;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type StrategicAlignmentIntegritySnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  coherencePosture: CoherencePosture;
  coherenceHeadline: string;
  coherenceSubline: string;
  alignmentIntegrityLine: string;
  operationalHarmonyLine: string;
  fragmentationAwarenessLine: string;
  timelineCoherenceLine: string;
  assistantCoherenceLine: string;
  enterpriseCoherenceActive: boolean;
  strategicAlignmentIntegrityActive: boolean;
  canonical: EnterpriseStrategicCoherence | null;
  coherenceStable: boolean;
};

export const STRATEGIC_ALIGNMENT_INTEGRITY_SYNC_EVENT =
  "nexora:strategic-alignment-integrity-sync" as const;
