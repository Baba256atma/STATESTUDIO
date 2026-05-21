/** D9:8:10 — Unified institutional consciousness runtime + civilization-scale enterprise intelligence completion types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { CivilizationAdaptationSnapshot } from "./civilizationAdaptationTypes";
import type { CivilizationContinuitySnapshot } from "./civilizationContinuityTypes";
import type { CivilizationCoordinationSnapshot } from "./civilizationCoordinationTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { CivilizationStewardshipSnapshot } from "./civilizationStewardshipTypes";
import type { CivilizationWisdomSnapshot } from "./civilizationWisdomTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type InstitutionalConsciousnessSubsystemId =
  | "institutional_consciousness"
  | "ecosystem_synchronization"
  | "civilization_fragility"
  | "institutional_influence"
  | "civilization_continuity"
  | "civilization_adaptation"
  | "civilization_coordination"
  | "civilization_wisdom"
  | "civilization_stewardship";

export type UnifiedInstitutionalConsciousnessRuntimeStatus =
  | "initializing"
  | "stable"
  | "adaptive"
  | "pressured"
  | "recovering";

export type InstitutionalAwarenessLevel =
  | "weak"
  | "moderate"
  | "systemic"
  | "institutional_grade"
  | "civilization_scale";

export type InstitutionalConsciousnessSubsystemState = {
  subsystemId: InstitutionalConsciousnessSubsystemId;
  status: UnifiedInstitutionalConsciousnessRuntimeStatus;
  observationCount: number;
  awarenessLevel: InstitutionalAwarenessLevel;
  headline: string;
  active: boolean;
  lastUpdatedAt: number;
};

export type MacroSystemAwarenessSummary = {
  ecosystemState: string;
  continuityState: string;
  adaptationState: string;
  coordinationState: string;
  wisdomState: string;
  stewardshipState: string;
  primaryMacroRisk: string;
  primaryMacroOpportunity: string;
};

export type InstitutionalConsciousnessHealth = {
  level: InstitutionalAwarenessLevel;
  integrityState: string;
  macroHeadline: string;
  resiliencePosture: string;
};

export type CivilizationScaleRuntimeSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedSubsystems: readonly InstitutionalConsciousnessSubsystemId[];
  signalIntensity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type CivilizationScaleEnterpriseSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  runtimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus;
  awarenessLevel: InstitutionalAwarenessLevel;
  summary: MacroSystemAwarenessSummary;
  activeSubsystems: readonly InstitutionalConsciousnessSubsystemId[];
  subsystemStates: readonly InstitutionalConsciousnessSubsystemState[];
  institutionalConsciousnessHealth: InstitutionalConsciousnessHealth;
  runtimeSignals: readonly CivilizationScaleRuntimeSignal[];
};

export type InstitutionalConsciousnessRuntimeHistoryEntry = {
  entryId: string;
  awarenessLevel: InstitutionalAwarenessLevel;
  runtimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus;
  headline: string;
  generatedAt: number;
};

export type UnifiedInstitutionalConsciousnessState = {
  enterpriseSnapshots: readonly CivilizationScaleEnterpriseSnapshot[];
  subsystemStates: readonly InstitutionalConsciousnessSubsystemState[];
  runtimeHistory: readonly InstitutionalConsciousnessRuntimeHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: UnifiedInstitutionalConsciousnessRuntimeStatus | null;
};

export type UnifiedInstitutionalConsciousnessRuntimeInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  institutionalConsciousnessSnapshot?: InstitutionalConsciousnessSnapshot | null;
  ecosystemSynchronizationSnapshot?: EcosystemSynchronizationSnapshot | null;
  civilizationFragilitySnapshot?: CivilizationFragilitySnapshot | null;
  institutionalInfluenceSnapshot?: InstitutionalInfluenceSnapshot | null;
  civilizationContinuitySnapshot?: CivilizationContinuitySnapshot | null;
  civilizationAdaptationSnapshot?: CivilizationAdaptationSnapshot | null;
  civilizationCoordinationSnapshot?: CivilizationCoordinationSnapshot | null;
  civilizationWisdomSnapshot?: CivilizationWisdomSnapshot | null;
  civilizationStewardshipSnapshot?: CivilizationStewardshipSnapshot | null;
  unifiedConsensusSnapshot?: DistributedExecutiveCognitionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  now?: number;
};

export type UnifiedInstitutionalConsciousnessRuntimeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationScaleEnterpriseSnapshot | null;
  activeSubsystemCount: number;
  storeSignature: string;
};
