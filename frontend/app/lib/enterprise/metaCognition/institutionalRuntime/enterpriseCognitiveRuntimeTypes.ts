/** F10:6 — Autonomous institutional intelligence + final enterprise cognitive runtime types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

export type OperationalRuntimeState = "stable" | "pressurized" | "synchronized";

export type GovernanceRuntimeState = "idle" | "active" | "orchestrated";

export type ResilienceRuntimeState = "fragile" | "coordinated" | "sustained";

export type StrategicAdvisoryRuntimeState = "bounded" | "synchronized" | "coherent";

export type ForesightRuntimeState = "idle" | "active" | "synchronized";

export type InstitutionalLearningRuntimeState = "nascent" | "maturing" | "complete";

export type ExecutiveAttentionRuntimeState = "distributed" | "synchronized" | "escalation_aware";

export type CognitionIntegrityRuntime = "fragmented" | "synchronizing" | "complete";

export type ContinuityHealthRuntime = "degraded" | "preserved" | "strong";

export type SynchronizationHealth = "unstable" | "stabilizing" | "synchronized" | "complete";

export type AdaptationRuntimeState = "nascent" | "evolving" | "sustained";

export type InstitutionalIntelligencePosture =
  | "idle"
  | "initializing"
  | "synchronizing"
  | "operational"
  | "complete"
  | "attention";

/** Canonical final enterprise cognitive runtime contract. */
export type EnterpriseCognitiveRuntimeState = {
  organizationId: string;
  operationalState: OperationalRuntimeState;
  governanceState: GovernanceRuntimeState;
  resilienceState: ResilienceRuntimeState;
  strategicAdvisoryState: StrategicAdvisoryRuntimeState;
  foresightState: ForesightRuntimeState;
  institutionalLearningState: InstitutionalLearningRuntimeState;
  executiveAttentionState: ExecutiveAttentionRuntimeState;
  cognitionIntegrity: CognitionIntegrityRuntime;
  continuityHealth: ContinuityHealthRuntime;
  synchronizationHealth: SynchronizationHealth;
  strategicConfidence: number;
  adaptationState: AdaptationRuntimeState;
  uncertaintyFactors: readonly string[];
  synchronizedAt: number;
};

export type SynthesizeEnterpriseCognitiveRuntimeInput = {
  organizationId: string;
  intelligenceStack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  runtimeStable: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type AutonomousInstitutionalIntelligenceRuntimeSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  institutionalIntelligencePosture: InstitutionalIntelligencePosture;
  institutionalHeadline: string;
  institutionalSubline: string;
  synchronizationHealthLine: string;
  adaptationContinuityLine: string;
  executiveCognitionSyncLine: string;
  timelineInstitutionalContinuityLine: string;
  assistantInstitutionalIntelligenceLine: string;
  autonomousInstitutionalIntelligenceActive: boolean;
  enterpriseCognitiveRuntimeComplete: boolean;
  canonical: EnterpriseCognitiveRuntimeState | null;
  runtimeStable: boolean;
};

export const AUTONOMOUS_INSTITUTIONAL_INTELLIGENCE_SYNC_EVENT =
  "nexora:autonomous-institutional-intelligence-sync" as const;
