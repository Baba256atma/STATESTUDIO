/** F9:6 — Unified adaptive governance runtime + institutional strategic evolution types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { InstitutionalCognitionConvergenceInput } from "../adaptiveGovernanceTypes";

export type GovernanceContinuity = "broken" | "forming" | "sustained" | "coherent";

export type OperationalCoherenceContinuity = "fragmented" | "aligning" | "harmonized" | "mature";

export type ExecutiveStabilityContinuity = "fragile" | "stabilizing" | "stable" | "composed";

export type AdaptationGovernanceMaturitySync = "nascent" | "developing" | "mature" | "strained";

export type InstitutionalEvolutionSync = "dormant" | "converging" | "synchronized" | "progressive";

export type EnterpriseStrategicContinuity = "disrupted" | "forming" | "sustained" | "coherent";

export type SelfRegulationDiscipline = "reactive" | "forming" | "disciplined" | "mature";

export type EvolutionConvergencePosture =
  | "idle"
  | "converging"
  | "synchronized"
  | "self_regulating"
  | "attention";

/** Canonical institutional strategic evolution contract (session-scoped, deterministic). */
export type InstitutionalStrategicEvolution = {
  organizationId: string;
  governanceContinuity: GovernanceContinuity;
  operationalCoherence: OperationalCoherenceContinuity;
  executiveStabilityContinuity: ExecutiveStabilityContinuity;
  adaptationGovernanceMaturity: AdaptationGovernanceMaturitySync;
  institutionalEvolutionSync: InstitutionalEvolutionSync;
  enterpriseStrategicContinuity: EnterpriseStrategicContinuity;
  selfRegulationDiscipline: SelfRegulationDiscipline;
  confidence: number;
  timestamp: number;
};

export type SynthesizeInstitutionalStrategicEvolutionInput = {
  organizationId: string;
  institutional: InstitutionalCognitionConvergenceInput | null;
  stack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type UnifiedAdaptiveGovernanceRuntimeSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  evolutionConvergencePosture: EvolutionConvergencePosture;
  unifiedGovernanceHeadline: string;
  unifiedGovernanceSubline: string;
  strategicEvolutionLine: string;
  selfRegulationLine: string;
  timelineStrategicEvolutionLine: string;
  assistantUnifiedGovernanceLine: string;
  unifiedGovernanceRuntimeActive: boolean;
  institutionalStrategicEvolutionConverged: boolean;
  canonical: InstitutionalStrategicEvolution | null;
  runtimeStable: boolean;
};

export const UNIFIED_ADAPTIVE_GOVERNANCE_RUNTIME_SYNC_EVENT =
  "nexora:unified-adaptive-governance-runtime-sync" as const;
