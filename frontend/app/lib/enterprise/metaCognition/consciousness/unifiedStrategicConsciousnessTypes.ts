/** F10:5 — Unified strategic consciousness + enterprise meta-intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

export type GovernanceConsciousnessState = "idle" | "active" | "coherent" | "strained";

export type OperationalIntelligenceState = "stable" | "pressurized" | "evolving";

export type ResilienceConsciousnessState = "fragile" | "strengthening" | "sustained";

export type StrategicTrajectoryState = "stable" | "ascending" | "adapting" | "at_risk";

export type InstitutionalLearningState = "nascent" | "forming" | "maturing" | "sustained";

export type ForesightConsciousnessState = "idle" | "observing" | "active" | "sustained";

export type AdvisoryConsciousnessState = "bounded" | "synchronized" | "coherent";

export type ExecutiveAttentionState = "distributed" | "focused" | "escalation_aware";

export type ContinuityHealth = "degraded" | "preserved" | "strong";

export type CognitionIntegrity = "fragmented" | "synchronizing" | "harmonized" | "orchestrated";

export type MetaIntelligencePosture =
  | "idle"
  | "synchronizing"
  | "harmonized"
  | "orchestrated"
  | "sustained"
  | "attention";

/** Canonical unified strategic consciousness contract (deterministic orchestration). */
export type UnifiedStrategicConsciousnessState = {
  organizationId: string;
  governanceState: GovernanceConsciousnessState;
  operationalIntelligence: OperationalIntelligenceState;
  resilienceState: ResilienceConsciousnessState;
  strategicTrajectory: StrategicTrajectoryState;
  institutionalLearningState: InstitutionalLearningState;
  foresightState: ForesightConsciousnessState;
  advisoryState: AdvisoryConsciousnessState;
  executiveAttentionState: ExecutiveAttentionState;
  strategicConfidence: number;
  continuityHealth: ContinuityHealth;
  cognitionIntegrity: CognitionIntegrity;
  uncertaintyFactors: readonly string[];
  synchronizedAt: number;
};

export type SynthesizeUnifiedStrategicConsciousnessInput = {
  organizationId: string;
  intelligenceStack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type UnifiedStrategicConsciousnessRuntimeSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  metaIntelligencePosture: MetaIntelligencePosture;
  consciousnessHeadline: string;
  consciousnessSubline: string;
  cognitionIntegrityLine: string;
  continuityHealthLine: string;
  crossLayerSyncLine: string;
  executiveAttentionLine: string;
  timelineStrategicContinuityLine: string;
  assistantMetaIntelligenceLine: string;
  unifiedStrategicConsciousnessActive: boolean;
  enterpriseMetaIntelligenceActive: boolean;
  canonical: UnifiedStrategicConsciousnessState | null;
  orchestrationStable: boolean;
};

export const UNIFIED_STRATEGIC_CONSCIOUSNESS_SYNC_EVENT =
  "nexora:unified-strategic-consciousness-sync" as const;
